# 🚀 Taja - AI-Powered Image Search

[![FastAPI](https://img.shields.io/badge/FastAPI-0.95.2-green?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)](https://www.docker.com/)

> **AI-powered image-based product search and catalog management for Taja and e-commerce platforms.**

---

## ✨ What is Taja?

Taja brings advanced, AI-powered image and video search to Taja and similar e-commerce solutions. It enables you to:

- 🔍 **Search products by image, video, or text**
- 🛒 **Add products with rich details and multiple images**
- ⚡ **Get fast, accurate, and scalable results**
- 🤖 **Integrate seamlessly with your e-commerce workflows**
- 📊 **Real-time progress tracking for all operations**

All operations are performed securely and efficiently, with a focus on privacy and reliability.

---

## 🎯 Key Features

- **AI-Powered Retrieval-Augmented Generation (RAG)**
  - Understands and matches product images with high precision
  - Combines visual and textual information for smarter search
  - Continuously improves search relevance and user experience
- **Asynchronous Processing with Progress Tracking**
  - All search and add product requests are queued and processed asynchronously
  - Real-time progress updates (0-100%) with descriptive messages
  - Redis-based progress storage for reliable tracking
- **Rich Product Management**
  - Add products with images, descriptions, categories, and more
  - Progress tracking for image processing, embedding generation, and uploads
- **Enterprise-Grade Security**
  - All data processed securely in the cloud
  - Redis caching for improved performance

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure environment
- Copy `.env.example` to `.env` and fill in your database and Cloudinary credentials.
- Ensure Redis is running for progress tracking and caching.

### 3. Run the development server (with auto-reload)
```bash
python dev_server.py
```

Or run manually:
```bash
# Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Start Celery worker (in another terminal)
celery -A app.worker.celery_app worker --loglevel=info --pool=solo
```

---

## 🛠️ API Endpoints

### Health & Metrics
- `GET /` — Health check
- `GET /health` — Detailed health status
- `GET /metrics` — Service metrics

### Product Management
- `POST /add_product` — Add a new product with images and details
  - **Form fields:** `name`, `price`, `description`, `category`
  - **Files:** Multiple images as `images`
  - **Response:** `{"job_id": "...", "status": "processing"}`
  - **Progress:** Poll `/add_product/progress/{job_id}` for real-time updates
  - **Result:** Poll `/add_product/job/{job_id}` for final result

- `GET /add_product/progress/{job_id}` — Get real-time progress for add product job
  - **Response:** `{"progress": 75, "message": "Processing image 2/3...", "timestamp": 1234567890}`

- `GET /add_product/job/{job_id}` — Get add product job status/result
  - **Response:** `{"status": "completed", "result": {...}}`

### Product Search
- `POST /search` — Search for products by image, video, or text query (all async via queue)
  - **Files:**
    - One image as `image` (supports .jpg, .png)
    - One video as `video` (supports .mp4, .avi, .mov, .mkv)
  - **Optional:** `query` (text)
  - **Response:** `{"job_id": "...", "status": "processing"}`
  - **Progress:** Poll `/search/progress/{job_id}` for real-time updates
  - **Result:** Poll `/search/job/{job_id}` for final result

- `GET /search/progress/{job_id}` — Get real-time progress for search job
  - **Response:** `{"progress": 60, "message": "Comparing with product database...", "timestamp": 1234567890}`

- `GET /search/job/{job_id}` — Get search job status/result
  - **Response:** `{"status": "completed", "result": {"matches": [...]}}`

### Progress Tracking Examples

**Image Search Progress:**
```
🔄 0% - Starting image search...
🔄 20% - Processing image...
🔄 40% - Generating image embedding...
🔄 60% - Comparing with product database...
🔄 75% - Checking product 15/50...
🔄 95% - Finalizing results...
✅ Search completed!
```

**Add Product Progress:**
```
🔄 0% - Starting product addition...
🔄 5% - Processing 3 images...
🔄 28% - Processing image 1/3...
🔄 33% - Generating embedding for image 1...
🔄 38% - Uploading image 1 to Cloudinary...
🔄 43% - Image 1 processed successfully
🔄 90% - Saving product to database...
✅ Product added successfully! Images: 3, Duplicates: 0, Errors: 0
```

### Example API Usage

**Image Search with Progress:**
```bash
# Start search
curl -X POST -F "image=@search1.jpg" http://localhost:8000/search
# Response: {"job_id": "abc123", "status": "processing"}

# Check progress
curl http://localhost:8000/search/progress/abc123
# Response: {"progress": 60, "message": "Comparing with product database..."}

# Get final result
curl http://localhost:8000/search/job/abc123
# Response: {"status": "completed", "result": {"matches": [...]}}
```

**Add Product with Progress:**
```bash
# Start add product
curl -X POST -F "images=@product1.jpg" -F "images=@product2.jpg" \
  -F "name=Test Product" -F "price=1000" \
  -F "description=Test description" -F "category=Test" \
  http://localhost:8000/add_product
# Response: {"job_id": "def456", "status": "processing"}

# Check progress
curl http://localhost:8000/add_product/progress/def456
# Response: {"progress": 50, "message": "Processing image 2/3..."}

# Get final result
curl http://localhost:8000/add_product/job/def456
# Response: {"status": "completed", "result": {"status": "success", "added": 1}}
```

---

## 📦 Usage Notes
- All product images and video frames are processed securely in the cloud.
- Progress tracking provides real-time updates for better user experience.
- Redis is used for progress storage and result caching (1-hour TTL).
- The API is designed for seamless integration with Taja and other e-commerce solutions.
- For best results, use high-quality product images or clear videos showing the product.

---

## 🔧 Development

### Auto-Restart Development Server
Use the included development script for automatic restart on file changes:
```bash
python dev_server.py
```

This script:
- Monitors the `app/` directory for changes
- Automatically restarts both FastAPI server and Celery worker
- Uses Windows-compatible Celery configuration (`--pool=solo`)

### Testing
Run the comprehensive test suite:
```bash
python test/api_test.py
```

The test script includes progress tracking and shows real-time updates for all operations.

---

## 🤝 Support
For integration help or questions, contact the Taja development team.

> **Note:** This service is intended for internal use and integration. For more details, see the main project documentation. 