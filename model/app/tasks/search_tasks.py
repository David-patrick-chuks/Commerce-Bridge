from app.worker import celery_app
from app.core.clip_utils import image_to_embedding, batch_images_to_embeddings
import numpy as np
import cv2
from PIL import Image
import io
import tempfile
import os

def get_cache_key(video_bytes=None, image_bytes=None, query=None):
    import hashlib
    m = hashlib.sha256()
    if video_bytes:
        m.update(video_bytes)
    if image_bytes:
        m.update(image_bytes)
    if query:
        m.update(query.encode("utf-8"))
    return m.hexdigest()

@celery_app.task
def video_search_task(video_bytes, query, products_data):
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
    frames = extract_frames_from_bytes(video_bytes, interval=2, max_frames=8)
    pil_frames = [Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)) for frame in frames if frame is not None]
    frame_embeddings = batch_images_to_embeddings(pil_frames, target_size=(224, 224), batch_size=8)
    SIMILARITY_THRESHOLD = 0.7
    product_matches = {}
    for emb in frame_embeddings:
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
    results = list(product_matches.values())
    results.sort(key=lambda x: max([m["similarity"] for m in x["matched_images"]]) if x["matched_images"] else 0, reverse=True)
    return {"matches": results[:5]}

@celery_app.task
def image_search_task(image_bytes, query, products_data):
    SIMILARITY_THRESHOLD = 0.7
    pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    query_embedding = image_to_embedding(pil_image)
    def cosine_sim(a, b):
        a = np.array(a)
        b = np.array(b)
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
    results = []
    for p in products_data:
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
    results.sort(key=lambda x: max([m["similarity"] for m in x["matched_images"]]) if x["matched_images"] else 0, reverse=True)
    return {"matches": results[:5]}

@celery_app.task
def text_search_task(query, products_data):
    results = []
    for p in products_data:
        results.append({
            "name": p["name"],
            "price": p["price"],
            "description": p["description"],
            "category": p["category"],
            "image_urls": p["image_urls"],
            "matched_images": []
        })
    return {"matches": results[:5]} 