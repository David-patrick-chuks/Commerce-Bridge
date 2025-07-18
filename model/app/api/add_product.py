from fastapi import APIRouter, UploadFile, File, Form, status
from fastapi.responses import JSONResponse
from typing import List
from app.core.db import get_products_collection
from app.core.clip_utils import image_to_embedding
from app.core.schemas import ErrorResponse
from app.worker import celery_app
from app.tasks.product_tasks import add_product_task
import hashlib
import io
from PIL import Image
import cloudinary
import cloudinary.uploader
import os
import json
import time
import redis

# Cloudinary config
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

router = APIRouter()

# Connect to Redis for progress tracking
try:
    redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    redis_client.ping()
except Exception as e:
    redis_client = None

@router.post(
    "/add_product",
    tags=["Products"],
    summary="Add a new product with multiple images and details",
    response_description="Status of product addition",
    responses={
        200: {"description": "Product added successfully.", "content": {"application/json": {"example": {"status": "success", "added": 1, "duplicates": 0, "errors": 0}}}},
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