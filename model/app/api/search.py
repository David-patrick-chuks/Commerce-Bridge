from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from app.core.db import get_products_collection
from app.core.schemas import ProductSearchResult, SearchResponse, ErrorResponse
from app.worker import celery_app
from app.tasks.search_tasks import video_search_task, image_search_task, text_search_task
import io
from PIL import Image
import numpy as np
from typing import Optional
import mimetypes
import hashlib
import redis
import json
import logging
from bson import ObjectId

router = APIRouter()

# Connect to Redis
try:
    redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    redis_client.ping()
    logging.info("Connected to Redis for caching.")
except Exception as e:
    redis_client = None
    logging.warning(f"Redis unavailable, caching disabled: {e}")

def get_cache_key(video_bytes=None, image_bytes=None, query=None):
    m = hashlib.sha256()
    if video_bytes:
        m.update(video_bytes)
    if image_bytes:
        m.update(image_bytes)
    if query:
        m.update(query.encode("utf-8"))
    return m.hexdigest()

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
        if video is not None:
            filename = video.filename or ""
            content_type = mimetypes.guess_type(filename)[0] or ""
            video_bytes = await video.read()
            job = video_search_task.delay(video_bytes, query, products_clean)
            return JSONResponse(
                status_code=202,
                content={"job_id": job.id, "status": "processing"}
            )
        elif image is not None:
            filename = image.filename or ""
            content_type = mimetypes.guess_type(filename)[0] or ""
            image_bytes = await image.read()
            job = image_search_task.delay(image_bytes, query, products_clean)
            return JSONResponse(
                status_code=202,
                content={"job_id": job.id, "status": "processing"}
            )
        else:
            # Text-only search
            job = text_search_task.delay(query, products_clean)
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