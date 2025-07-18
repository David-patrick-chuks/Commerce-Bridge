from app.worker import celery_app
from app.core.db import get_products_collection
from app.core.clip_utils import image_to_embedding
import hashlib
import io
from PIL import Image
import cloudinary
import cloudinary.uploader
import os
import redis
import json
import time

# Redis client for progress tracking
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

def update_progress(job_id, progress, message=""):
    """Update progress in Redis"""
    if redis_client:
        progress_data = {
            "progress": progress,
            "message": message,
            "timestamp": time.time()
        }
        redis_client.set(f"progress:{job_id}", json.dumps(progress_data), ex=3600)

@celery_app.task(bind=True)
def add_product_task(self, images_data, name, price, description, category):
    job_id = self.request.id
    try:
        update_progress(job_id, 0, "Starting product addition...")
        
        products_col = get_products_collection()
        image_urls = []
        image_hashes = []
        embeddings = []
        duplicates = 0
        errors = 0
        error_details = []
        
        total_images = len(images_data)
        update_progress(job_id, 5, f"Processing {total_images} images...")
        
        for i, image_bytes in enumerate(images_data):
            try:
                # Calculate progress for this image
                image_progress = 5 + (i / total_images) * 80
                update_progress(job_id, int(image_progress), f"Processing image {i+1}/{total_images}...")
                
                # Generate hash
                sha256 = hashlib.sha256(image_bytes).hexdigest()
                
                # Check for duplicates
                if products_col.find_one({"image_hashes": sha256}):
                    duplicates += 1
                    update_progress(job_id, int(image_progress), f"Image {i+1} is duplicate, skipping...")
                    continue
                
                # Process image
                update_progress(job_id, int(image_progress + 5), f"Generating embedding for image {i+1}...")
                pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
                embedding = image_to_embedding(pil_image)
                
                # Upload to Cloudinary
                update_progress(job_id, int(image_progress + 10), f"Uploading image {i+1} to Cloudinary...")
                upload_result = cloudinary.uploader.upload(io.BytesIO(image_bytes), folder="clip-products")
                image_url = upload_result["secure_url"]
                
                # Store data
                image_urls.append(image_url)
                image_hashes.append(sha256)
                embeddings.append(embedding)
                
                update_progress(job_id, int(image_progress + 15), f"Image {i+1} processed successfully")
                
            except Exception as e:
                errors += 1
                error_details.append(str(e))
                update_progress(job_id, int(image_progress), f"Error processing image {i+1}: {str(e)}")
        
        update_progress(job_id, 85, "Checking results...")
        
        if len(image_urls) == 0:
            update_progress(job_id, 100, f"Product addition completed. No new images added. Duplicates: {duplicates}, Errors: {errors}")
            return {
                "status": "duplicate",
                "added": 0,
                "duplicates": duplicates,
                "errors": errors,
                "error_details": error_details
            }
        
        update_progress(job_id, 90, "Saving product to database...")
        
        # Create product document
        product_doc = {
            "name": name,
            "price": price,
            "description": description,
            "category": category,
            "image_urls": image_urls,
            "image_hashes": image_hashes,
            "embeddings": embeddings,
        }
        
        # Insert into database
        products_col.insert_one(product_doc)
        
        update_progress(job_id, 100, f"Product added successfully! Images: {len(image_urls)}, Duplicates: {duplicates}, Errors: {errors}")
        
        return {
            "status": "success",
            "added": 1,
            "duplicates": duplicates,
            "errors": errors,
            "error_details": error_details
        }
        
    except Exception as e:
        update_progress(job_id, -1, f"Error adding product: {str(e)}")
        print(f"Error in add_product_task: {e}")
        raise 