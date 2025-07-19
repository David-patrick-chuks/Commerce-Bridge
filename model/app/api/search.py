from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from fastapi.responses import JSONResponse
from app.core.db import get_products_collection
from app.core.schemas import ProductSearchResult, SearchResponse, ErrorResponse
from app.core.config import settings
from app.worker import celery_app
from app.tasks.search_tasks import video_search_task, image_search_task, text_search_task
import io
from PIL import Image
import numpy as np
from typing import Optional, List
import mimetypes
import hashlib
import redis
import json
import logging
from bson import ObjectId
import time

router = APIRouter()

# Connect to Redis
try:
    redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
    redis_client.ping()
    logging.info("Connected to Redis for caching.")
except Exception as e:
    redis_client = None
    logging.warning(f"Redis unavailable, caching disabled: {e}")

CACHE_TTL = 3600  # 1 hour

def get_cache_key(video_bytes=None, image_bytes=None, query=None):
    m = hashlib.sha256()
    if video_bytes:
        m.update(video_bytes)
    if image_bytes:
        m.update(image_bytes)
    if query:
        m.update(query.encode("utf-8"))
    return m.hexdigest()

def validate_file(file: UploadFile, max_size: int = None, allowed_types: List[str] = None) -> bool:
    """Validate uploaded file size and type"""
    if max_size is None:
        max_size = settings.MAX_FILE_SIZE
    
    if allowed_types is None:
        allowed_types = settings.ALLOWED_IMAGE_TYPES + settings.ALLOWED_VIDEO_TYPES
    
    # Check file size
    if file.size and file.size > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File {file.filename} is too large. Maximum size is {max_size // (1024*1024)}MB"
        )
    
    # Check file type
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"File type {file.content_type} not allowed. Allowed types: {', '.join(allowed_types)}"
        )
    
    return True

@router.post(
    "/search",
    tags=["Products"],
    summary="Search for similar products by image or video (and optional text query)",
    response_model=None,
    response_description="Top product matches with similarity scores",
    responses={
        200: {"description": "Search results.", "content": {"application/json": {"example": {"matches": [
            {"name": "Cool Cap", "price": 2500, "description": "A stylish cap for all seasons.", "category": "Accessories", "image_urls": ["...", "...", "...", "..."], "matched_images": [{"image_url": "...", "image_hash": "...", "similarity": 0.92}]}
        ]}}}},
        400: {"description": "Bad request.", "content": {"application/json": {"example": {"status": "error", "message": "Provide either an image or a video, not both."}}}},
        413: {"description": "File too large.", "content": {"application/json": {"example": {"detail": "File is too large"}}}},
        415: {"description": "Unsupported file type.", "content": {"application/json": {"example": {"detail": "File type not allowed"}}}},
        500: {"description": "Internal server error.", "content": {"application/json": {"example": {"status": "error", "message": "Error message."}}}},
    },
)
async def search_products(
    image: Optional[UploadFile] = File(None, description="Query image file (jpg/png)"),
    video: Optional[UploadFile] = File(None, description="Query video file (mp4/avi/mov/mkv)"),
    query: str = Form(None, description="Optional text query to filter products")
):
    """Search for similar products by uploading an image or a video (and optional text query). Returns top matches with similarity scores."""
    try:
        if (image is not None and video is not None) or (image is None and video is None):
            raise HTTPException(status_code=400, detail={"status": "error", "message": "Provide either an image or a video, not both."})
        
        # Validate uploaded files
        if image is not None:
            validate_file(image, settings.MAX_FILE_SIZE, settings.ALLOWED_IMAGE_TYPES)
        if video is not None:
            validate_file(video, settings.MAX_FILE_SIZE, settings.ALLOWED_VIDEO_TYPES)
        
        products_col = get_products_collection()
        mongo_filter = {}
        if query:
            words = query.split()
            regexes = (
                [{"name": {"$regex": w, "$options": "i"}} for w in words] +
                [{"description": {"$regex": w, "$options": "i"}} for w in words]
            )
            mongo_filter = {"$or": regexes}
        products = list(products_col.find(mongo_filter))
        if not products:
            return {"matches": []}
        def clean_product(p):
            p = dict(p)
            p.pop('_id', None)
            return p
        products_clean = [clean_product(p) for p in products]
        cache_key = None
        video_bytes = None
        image_bytes = None
        if video is not None:
            filename = video.filename or ""
            content_type = mimetypes.guess_type(filename)[0] or ""
            video_bytes = await video.read()
            cache_key = get_cache_key(video_bytes=video_bytes, query=query)
        elif image is not None:
            filename = image.filename or ""
            content_type = mimetypes.guess_type(filename)[0] or ""
            image_bytes = await image.read()
            cache_key = get_cache_key(image_bytes=image_bytes, query=query)
        else:
            cache_key = get_cache_key(query=query)
        # Check Redis cache before enqueuing job
        if redis_client and cache_key and redis_client.exists(cache_key):
            cached_result = redis_client.get(cache_key)
            return JSONResponse(status_code=200, content=json.loads(cached_result))
        # Enqueue Celery job as usual
        if video is not None:
            job = video_search_task.delay(video_bytes, query, products_clean)
            # Save cache_key in Redis for job_id mapping (optional, for debugging)
            if redis_client:
                redis_client.set(f"jobid:{job.id}", cache_key, ex=CACHE_TTL)
            return JSONResponse(
                status_code=202,
                content={"job_id": job.id, "status": "processing"}
            )
        elif image is not None:
            job = image_search_task.delay(image_bytes, query, products_clean)
            if redis_client:
                redis_client.set(f"jobid:{job.id}", cache_key, ex=CACHE_TTL)
            return JSONResponse(
                status_code=202,
                content={"job_id": job.id, "status": "processing"}
            )
        else:
            # Text-only search
            job = text_search_task.delay(query, products_clean)
            if redis_client:
                redis_client.set(f"jobid:{job.id}", cache_key, ex=CACHE_TTL)
            return JSONResponse(
                status_code=202,
                content={"job_id": job.id, "status": "processing"}
            )
    except HTTPException as he:
        raise he
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

# Endpoint to check job status/results
@router.get("/search/job/{job_id}", tags=["Products"], summary="Get video search job status/result")
def get_search_job(job_id: str):
    res = celery_app.AsyncResult(job_id)
    if res.state == "PENDING":
        return {"job_id": job_id, "status": "pending"}
    elif res.state == "STARTED":
        return {"job_id": job_id, "status": "processing"}
    elif res.state == "SUCCESS":
        return {"job_id": job_id, "status": "completed", "result": res.result}
    elif res.state == "FAILURE":
        return {"job_id": job_id, "status": "failed", "error": str(res.info)}
    else:
        return {"job_id": job_id, "status": res.state.lower()}

# Endpoint to get job progress
@router.get("/search/progress/{job_id}", tags=["Products"], summary="Get job progress")
def get_job_progress(job_id: str):
    """Get real-time progress for a search job"""
    try:
        if redis_client:
            progress_data = redis_client.get(f"progress:{job_id}")
            if progress_data:
                progress = json.loads(progress_data)
                return {
                    "job_id": job_id,
                    "progress": progress["progress"],
                    "message": progress["message"],
                    "timestamp": progress["timestamp"]
                }
        
        # Fallback to job status if no progress data
        res = celery_app.AsyncResult(job_id)
        if res.state == "PENDING":
            return {"job_id": job_id, "progress": 0, "message": "Job queued", "timestamp": time.time()}
        elif res.state == "STARTED":
            return {"job_id": job_id, "progress": 10, "message": "Job started", "timestamp": time.time()}
        elif res.state == "SUCCESS":
            return {"job_id": job_id, "progress": 100, "message": "Job completed", "timestamp": time.time()}
        elif res.state == "FAILURE":
            return {"job_id": job_id, "progress": -1, "message": f"Job failed: {str(res.info)}", "timestamp": time.time()}
        else:
            return {"job_id": job_id, "progress": 0, "message": f"Job status: {res.state}", "timestamp": time.time()}
    except Exception as e:
        return {"job_id": job_id, "progress": -1, "message": f"Error getting progress: {str(e)}", "timestamp": time.time()} 