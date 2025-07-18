from app.worker import celery_app
from app.core.db import get_products_collection
from app.core.clip_utils import image_to_embedding
import hashlib
import io
from PIL import Image
import cloudinary
import cloudinary.uploader
import os

@celery_app.task
def add_product_task(images_data, name, price, description, category):
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