from fastapi import APIRouter, UploadFile, File, Form, status
from fastapi.responses import JSONResponse
from typing import List
from app.core.db import get_products_collection
from app.core.clip_utils import image_to_embedding
from app.core.schemas import ErrorResponse
from app.worker import celery_app
import hashlib
import io
from PIL import Image
import cloudinary
import cloudinary.uploader
import os

# Cloudinary config
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

router = APIRouter()

@celery_app.task
def add_product_task(images_data, name, price, description, category):
    from app.core.db import get_products_collection
    from app.core.clip_utils import image_to_embedding
    import hashlib
    import io
    from PIL import Image
    import cloudinary
    import cloudinary.uploader
    products_col = get_products_collection()
    image_urls = []
    image_hashes = []
    embeddings = []
    duplicates = 0
    errors = 0
    error_details = []
    for image_bytes in images_data:
        try:
            sha256 = hashlib.sha256(image_bytes).hexdigest()
            if products_col.find_one({"image_hashes": sha256}):
                duplicates += 1
                continue
            pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            embedding = image_to_embedding(pil_image)
            upload_result = cloudinary.uploader.upload(io.BytesIO(image_bytes), folder="clip-products")
            image_url = upload_result["secure_url"]
            image_urls.append(image_url)
            image_hashes.append(sha256)
            embeddings.append(embedding)
        except Exception as e:
            errors += 1
            error_details.append(str(e))
    if len(image_urls) == 0:
        return {
            "status": "duplicate",
            "added": 0,
            "duplicates": duplicates,
            "errors": errors,
            "error_details": error_details
        }
    product_doc = {
        "name": name,
        "price": price,
        "description": description,
        "category": category,
        "image_urls": image_urls,
        "image_hashes": image_hashes,
        "embeddings": embeddings,
    }
    products_col.insert_one(product_doc)
    return {
        "status": "success",
        "added": 1,
        "duplicates": duplicates,
        "errors": errors,
        "error_details": error_details
    }

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