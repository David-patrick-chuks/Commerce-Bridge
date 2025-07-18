# Taja Model Service (Python AI Backend)

> **This is the Python AI/model microservice for Taja. It powers product image search, catalog management, and multimodal retrieval for the main platform.**

---

## Overview
This service is a FastAPI-based backend that provides advanced, AI-powered product search and catalog management for Taja. It enables:
- Adding products with multiple images (deduplication, embedding, and storage)
- Searching for products by image, video, or text (all async via job queue)
- Health and metrics endpoints for monitoring

All operations are performed asynchronously using Celery, with job polling endpoints for status/results. The service is tailored for e-commerce and WhatsApp-first workflows.

---

## Key Features
- **FastAPI** HTTP API for product management and search
- **OpenAI CLIP (ViT-L/14)** for image embeddings
- **MongoDB Atlas** for product storage and vector search
- **Celery** for async/background processing (with Redis broker)
- **Cloudinary** for image hosting
- **Prometheus-style metrics** endpoint
- **Deduplication** via SHA256 image hashes
- **Health checks** for API, DB, and model

---

## API Endpoints

### Health & Metrics
- `GET /` — Basic health check
- `GET /health` — Full health check (API, DB, CLIP model)
- `GET /metrics` — Prometheus-style metrics

### Product Management
- `POST /add_product` — Add a new product with images and details (async, returns job_id)
- `GET /add_product/job/{job_id}` — Poll for add product job status/result

### Product Search
- `POST /search` — Search for products by image, video, or text (async, returns job_id)
- `GET /search/job/{job_id}` — Poll for search job status/result

---

## How It Works
- **Add Product**: Upload images and details. Images are deduplicated, embedded with CLIP, uploaded to Cloudinary, and stored in MongoDB. All processing is async (job-based).
- **Search**: Submit an image, video, or text query. The service finds the most similar products using hybrid vector and keyword search. All processing is async (job-based).
- **Job Polling**: All long-running tasks return a `job_id`. Poll the corresponding `/job/{job_id}` endpoint for status and results.

---

## How to Run (Development)

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
2. **Configure environment:**
   - Copy `.env.example` to `.env` and fill in MongoDB, Cloudinary, and Redis credentials.
3. **Start the API server:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
4. **Start the Celery worker:**
   ```bash
   celery -A app.worker.celery_app worker --loglevel=info
   ```

---

## Folder Structure (model/app/)
```
app/
├── api/           # API endpoints (add_product, search)
├── core/          # Core utilities (clip_utils, db, schemas)
├── tasks/         # Celery background tasks (image/video/text search, product tasks)
├── worker.py      # Celery app instance
├── main.py        # FastAPI app entrypoint
└── ...
```

---

## Tech Stack
- **Python 3.8+**
- **FastAPI** (REST API)
- **Celery** (async jobs, Redis broker)
- **MongoDB Atlas** (vector and metadata storage)
- **OpenAI CLIP (ViT-L/14)** (image embeddings)
- **Cloudinary** (image hosting)
- **Redis** (caching, Celery broker)
- **Pillow, scikit-learn, opencv-python, nltk** (image/video/text processing)

---

## Security, Scalability & Extensibility
- All uploads and endpoints should be secured in production
- Use HTTPS for all communications
- Deduplication enforced via SHA256
- Easily extensible for new product types or search modalities

---

## Example Usage
- Add a product:
  - `POST /add_product` with images and details (returns job_id)
  - Poll `/add_product/job/{job_id}` for result
- Search for products:
  - `POST /search` with image, video, or text (returns job_id)
  - Poll `/search/job/{job_id}` for result

---

For a high-level overview, see the main [README.md](./README.md) and [PROJECT_VISION.md](./PROJECT_VISION.md). 