from app.worker import celery_app
from app.core.clip_utils import image_to_embedding, batch_images_to_embeddings
import numpy as np
import cv2
from PIL import Image
import io
import tempfile
import os
import redis
import json
import hashlib
import time

CACHE_TTL = 3600  # 1 hour - updated for restart
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

def get_cache_key(video_bytes=None, image_bytes=None, query=None):
    m = hashlib.sha256()
    if video_bytes:
        m.update(video_bytes)
    if image_bytes:
        m.update(image_bytes)
    if query:
        m.update(query.encode("utf-8"))
    return m.hexdigest()

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
def video_search_task(self, video_bytes, query, products_data):
    job_id = self.request.id
    try:
        update_progress(job_id, 0, "Starting video search...")
        
        def extract_frames_from_bytes(video_bytes, interval=2, max_frames=8):
            with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tmp:
                tmp.write(video_bytes)
                tmp_path = tmp.name
            vidcap = cv2.VideoCapture(tmp_path)
            frames = []
            fps = vidcap.get(cv2.CAP_PROP_FPS) or 25
            count = 0
            while True:
                success, image = vidcap.read()
                if not success or len(frames) >= max_frames:
                    break
                if int(count % (fps * interval)) == 0:
                    frames.append(image)
                count += 1
            vidcap.release()
            os.remove(tmp_path)
            return frames
        
        update_progress(job_id, 5, "Loading video data...")
        update_progress(job_id, 10, "Extracting video frames...")
        frames = extract_frames_from_bytes(video_bytes, interval=2, max_frames=8)
        
        update_progress(job_id, 20, f"Extracted {len(frames)} frames from video...")
        update_progress(job_id, 25, "Converting frames to PIL images...")
        pil_frames = [Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)) for frame in frames if frame is not None]
        
        update_progress(job_id, 30, f"Converted {len(pil_frames)} frames...")
        update_progress(job_id, 35, "Preparing frames for AI analysis...")
        update_progress(job_id, 40, "Generating embeddings for video frames...")
        frame_embeddings = batch_images_to_embeddings(pil_frames, target_size=(224, 224), batch_size=8)
        
        update_progress(job_id, 50, f"Generated embeddings for {len(frame_embeddings)} frames...")
        update_progress(job_id, 55, "Starting database comparison...")
        
        SIMILARITY_THRESHOLD = 0.7
        product_matches = {}
        total_frames = len(frame_embeddings)
        
        for i, emb in enumerate(frame_embeddings):
            progress = 55 + (i / total_frames) * 25
            update_progress(job_id, int(progress), f"Processing frame {i+1}/{total_frames}...")
            
            emb_np = np.array(emb)
            for p in products_data:
                prod_embs = np.array(p["embeddings"])
                sims = np.dot(prod_embs, emb_np) / (np.linalg.norm(prod_embs, axis=1) * np.linalg.norm(emb_np) + 1e-8)
                sims = np.clip(sims, 0.0, 1.0)
                matched_images = []
                for idx, sim in enumerate(sims):
                    if sim >= SIMILARITY_THRESHOLD:
                        matched_images.append({
                            "image_url": p["image_urls"][idx],
                            "image_hash": p["image_hashes"][idx],
                            "similarity": float(sim)
                        })
                if matched_images:
                    if p["name"] not in product_matches:
                        product_matches[p["name"]] = {
                            "name": p["name"],
                            "price": p["price"],
                            "description": p["description"],
                            "category": p["category"],
                            "image_urls": p["image_urls"],
                            "matched_images": matched_images
                        }
                    else:
                        existing = product_matches[p["name"]]["matched_images"]
                        all_imgs = existing + matched_images
                        img_dict = {}
                        for m in all_imgs:
                            h = m["image_hash"]
                            if h not in img_dict or m["similarity"] > img_dict[h]["similarity"]:
                                img_dict[h] = m
                        product_matches[p["name"]]["matched_images"] = list(img_dict.values())
        
        update_progress(job_id, 85, f"Found {len(product_matches)} matching products...")
        update_progress(job_id, 90, "Finalizing results...")
        results = list(product_matches.values())
        results.sort(key=lambda x: max([m["similarity"] for m in x["matched_images"]]) if x["matched_images"] else 0, reverse=True)
        
        cache_key = get_cache_key(video_bytes=video_bytes, query=query)
        if redis_client:
            redis_client.set(cache_key, json.dumps(results), ex=CACHE_TTL)
        
        update_progress(job_id, 100, f"Video search completed! Found {len(results)} matches")
        return {"matches": results[:5]}
    except Exception as e:
        update_progress(job_id, -1, f"Error: {str(e)}")
        print(f"Error in video_search_task: {e}")
        raise

@celery_app.task(bind=True)
def image_search_task(self, image_bytes, query, products_data):
    job_id = self.request.id
    try:
        update_progress(job_id, 0, "Starting image search...")
        
        update_progress(job_id, 5, "Loading image data...")
        SIMILARITY_THRESHOLD = 0.7
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        update_progress(job_id, 15, "Processing image format...")
        update_progress(job_id, 25, "Preparing image for AI analysis...")
        
        update_progress(job_id, 35, "Generating image embedding...")
        query_embedding = image_to_embedding(pil_image)
        
        update_progress(job_id, 45, "Embedding generation completed...")
        update_progress(job_id, 50, "Starting database comparison...")
        
        def cosine_sim(a, b):
            a = np.array(a)
            b = np.array(b)
            return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
        
        results = []
        total_products = len(products_data)
        update_progress(job_id, 55, f"Comparing with {total_products} products...")
        
        for i, p in enumerate(products_data):
            # More granular progress updates
            progress = 55 + (i / total_products) * 35
            if i % max(1, total_products // 10) == 0:  # Update every 10% of products
                update_progress(job_id, int(progress), f"Checking product {i+1}/{total_products}...")
            
            matched_images = []
            for idx, emb in enumerate(p["embeddings"]):
                sim = cosine_sim(query_embedding, emb)
                sim = min(max(sim, 0.0), 1.0)
                if sim >= SIMILARITY_THRESHOLD:
                    matched_images.append({
                        "image_url": p["image_urls"][idx],
                        "image_hash": p["image_hashes"][idx],
                        "similarity": sim
                    })
            if matched_images:
                results.append({
                    "name": p["name"],
                    "price": p["price"],
                    "description": p["description"],
                    "category": p["category"],
                    "image_urls": p["image_urls"],
                    "matched_images": matched_images
                })
        
        update_progress(job_id, 90, f"Found {len(results)} matching products...")
        update_progress(job_id, 95, "Finalizing results...")
        results.sort(key=lambda x: max([m["similarity"] for m in x["matched_images"]]) if x["matched_images"] else 0, reverse=True)
        
        cache_key = get_cache_key(image_bytes=image_bytes, query=query)
        if redis_client:
            redis_client.set(cache_key, json.dumps(results), ex=CACHE_TTL)
        
        update_progress(job_id, 100, f"Search completed! Found {len(results)} matches")
        return {"matches": results[:5]}
    except Exception as e:
        update_progress(job_id, -1, f"Error: {str(e)}")
        print(f"Error in image_search_task: {e}")
        raise

@celery_app.task(bind=True)
def text_search_task(self, query, products_data):
    job_id = self.request.id
    try:
        update_progress(job_id, 0, "Starting text search...")
        
        update_progress(job_id, 50, "Processing text query...")
        results = []
        total_products = len(products_data)
        
        for i, p in enumerate(products_data):
            progress = 50 + (i / total_products) * 40
            update_progress(job_id, int(progress), f"Processing product {i+1}/{total_products}...")
            
            results.append({
                "name": p["name"],
                "price": p["price"],
                "description": p["description"],
                "category": p["category"],
                "image_urls": p["image_urls"],
                "matched_images": []
            })
        
        update_progress(job_id, 95, "Finalizing results...")
        
        cache_key = get_cache_key(query=query)
        if redis_client:
            redis_client.set(cache_key, json.dumps(results), ex=CACHE_TTL)
        
        update_progress(job_id, 100, "Search completed!")
        return {"matches": results[:5]}
    except Exception as e:
        update_progress(job_id, -1, f"Error: {str(e)}")
        print(f"Error in text_search_task: {e}")
        raise 