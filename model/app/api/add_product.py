from fastapi import APIRouter, UploadFile, File, Form, status, HTTPException
from fastapi.responses import JSONResponse
from typing import List
from app.core.db import get_products_collection
from app.core.clip_utils import image_to_embedding
from app.core.schemas import ErrorResponse
from app.core.config import settings
from app.worker import celery_app
from app.tasks.product_tasks import add_product_task
import hashlib
import io
from PIL import Image
import cloudinary
import cloudinary.uploader
import json
import time
import redis

# Cloudinary config
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)

router = APIRouter()

# Connect to Redis for progress tracking
try:
    redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
    redis_client.ping()
except Exception as e:
    redis_client = None

def validate_file(file: UploadFile, max_size: int = None, allowed_types: List[str] = None) -> bool:
    """Validate uploaded file size and type"""
    if max_size is None:
        max_size = settings.MAX_FILE_SIZE
    
    if allowed_types is None:
        allowed_types = settings.ALLOWED_IMAGE_TYPES
    
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
    "/add_product",
    tags=["Products"],
    summary="Add a new product with multiple images and details",
    response_description="Status of product addition",
    responses={
        200: {"description": "Product added successfully.", "content": {"application/json": {"example": {"status": "success", "added": 1, "duplicates": 0, "errors": 0}}}},
        413: {"description": "File too large.", "content": {"application/json": {"example": {"detail": "File is too large"}}}},
        415: {"description": "Unsupported file type.", "content": {"application/json": {"example": {"detail": "File type not allowed"}}}},
        500: {"description": "Internal server error.", "content": {"application/json": {"example": {"status": "error", "message": "Error message."}}}},
    },
)
async def add_product(
    images: List[UploadFile] = File(..., description="Product image files (jpg/png)"),
    name: str = Form(..., description="Product name"),
    price: float = Form(..., description="Product price"),
    description: str = Form(..., description="Product description"),
    category: str = Form(..., description="Product category")
):
    """Add a new product to the catalog. Deduplicates by image hash and embeds each image with CLIP."""
    
    # Validate all uploaded files
    for image in images:
        validate_file(image, settings.MAX_FILE_SIZE, settings.ALLOWED_IMAGE_TYPES)
    
    images_data = [await image.read() for image in images]
    job = add_product_task.delay(images_data, name, price, description, category)
    return JSONResponse(
        status_code=202,
        content={"job_id": job.id, "status": "processing"}
    )

@router.get("/add_product/job/{job_id}", tags=["Products"], summary="Get add product job status/result")
def get_add_product_job(job_id: str):
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

@router.get("/add_product/progress/{job_id}", tags=["Products"], summary="Get add product job progress")
def get_add_product_progress(job_id: str):
    """Get real-time progress for an add product job"""
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