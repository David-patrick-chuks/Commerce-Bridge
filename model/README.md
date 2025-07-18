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

All operations are performed securely and efficiently, with a focus on privacy and reliability.

---

## 🎯 Key Features

- **AI-Powered Retrieval-Augmented Generation (RAG)**
  - Understands and matches product images with high precision
  - Combines visual and textual information for smarter search
  - Continuously improves search relevance and user experience
- **Asynchronous Processing**
  - All search requests are queued and processed asynchronously for scalability
- **Rich Product Management**
  - Add products with images, descriptions, categories, and more
- **Enterprise-Grade Security**
  - All data processed securely in the cloud

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure environment
- Copy `.env.example` to `.env` and fill in your database and Cloudinary credentials.

### 3. Run the server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
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
- `POST /search` — Search for products by image, video, or text query (all async via queue)
  - **Files:**
    - One image as `image` (supports .jpg, .png)
    - One video as `video` (supports .mp4, .avi, .mov, .mkv)
  - **Optional:** `query` (text)
  - **How it works:**
    - All search requests are processed asynchronously via a queue.
    - The response includes a `job_id` and `status`.
    - Poll `/search/job/{job_id}` to retrieve the result when processing is complete.
  - **Example (image search with curl):**
    ```bash
    curl -X POST \
      -F "image=@images_data/Products/search1.jpg" \
      http://localhost:8000/search
    # Response: {"job_id": "...", "status": "processing"}
    # Then poll:
    curl http://localhost:8000/search/job/{job_id}
    ```
  - **Example (video search with curl):**
    ```bash
    curl -X POST \
      -F "video=@images_data/Products/search-video1.mp4" \
      http://localhost:8000/search
    # Response: {"job_id": "...", "status": "processing"}
    # Then poll:
    curl http://localhost:8000/search/job/{job_id}
    ```
  - **Example (text search with curl):**
    ```bash
    curl -X POST \
      -F "query=cap" \
      http://localhost:8000/search
    # Response: {"job_id": "...", "status": "processing"}
    # Then poll:
    curl http://localhost:8000/search/job/{job_id}
    ```

---

## 📦 Usage Notes
- All product images and video frames are processed securely in the cloud.
- The API is designed for seamless integration with Taja and other e-commerce solutions.
- For best results, use high-quality product images or clear videos showing the product.

---

## 🤝 Support
For integration help or questions, contact the Taja development team.

> **Note:** This service is intended for internal use and integration. For more details, see the main project documentation. 