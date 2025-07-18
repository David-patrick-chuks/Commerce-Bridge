# API Test Script for Taja

This directory contains a comprehensive API test script (`api_test.py`) for testing your Taja server's endpoints, product management, and AI-powered search functionality with real-time progress tracking.

## Features
- **Product Management Testing**
  - Adds all products from `images_data/products.json` to the server
  - Uploads all images for each product with progress tracking
  - Tests duplicate detection and error handling
- **AI Search Testing**
  - Runs search queries using images (`search1.jpg`, `search2.jpg`, `search3.jpg`)
  - Tests video search with `search-video1.mp4`
  - Tests text-based search queries
  - All searches processed asynchronously via queue
- **Progress Tracking**
  - Real-time progress updates (0-100%) for all operations
  - Descriptive progress messages showing current operation
  - Visual progress indicators with emojis (🔄, ✅, ❌)
- **Comprehensive Coverage**
  - Health and metrics endpoints
  - Add product with multiple images
  - Image, video, and text search functionality
  - Error handling and edge cases

## Requirements
- Python 3.8+
- `requests` and `cloudinary` Python packages
- Taja server running with Celery worker
- Redis server for progress tracking and caching
- All product images, search images, and test video present in `images_data/Products/`
- `products.json` in `images_data/` with product definitions

## Quick Start

### 1. Start the Development Server
```bash
# Option 1: Use auto-restart development script (recommended)
python dev_server.py

# Option 2: Manual startup
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# In another terminal:
celery -A app.worker.celery_app worker --loglevel=info --pool=solo
```

### 2. Run the Test Script
```bash
python test/api_test.py
```

### 3. Review Real-time Progress
The script will show progress updates like:
```
🔄 0% - Starting product addition...
🔄 5% - Processing 3 images...
🔄 28% - Processing image 1/3...
🔄 33% - Generating embedding for image 1...
🔄 38% - Uploading image 1 to Cloudinary...
🔄 43% - Image 1 processed successfully
✅ Product added successfully! Images: 3, Duplicates: 0, Errors: 0
```

## API Endpoints Tested

### Health & Metrics
- `GET /` — Health check
- `GET /health` — Detailed health status
- `GET /metrics` — Service metrics

### Product Management
- `POST /add_product` — Add products with images
- `GET /add_product/progress/{job_id}` — Real-time progress tracking
- `GET /add_product/job/{job_id}` — Job status and results

### Product Search
- `POST /search` — Search by image, video, or text
- `GET /search/progress/{job_id}` — Real-time progress tracking
- `GET /search/job/{job_id}` — Job status and results

## Progress Tracking Features

### Add Product Progress
- **0%** - Starting product addition
- **5%** - Processing images
- **5-85%** - Per-image processing (embedding, upload, etc.)
- **85%** - Checking results
- **90%** - Saving to database
- **100%** - Completion with summary

### Search Progress
- **Image Search**: 0% → 20% → 40% → 60-90% → 95% → 100%
- **Video Search**: 0% → 10% → 25% → 40% → 60-80% → 90% → 100%
- **Text Search**: 0% → 50% → 50-90% → 95% → 100%

## products.json Example
```json
[
  {
    "name": "Product Name",
    "price": 10000,
    "description": "Product description.",
    "image": [
      "images_data/Products/product1_img1.jpg",
      "images_data/Products/product1_img2.jpg"
    ],
    "category": "Category Name",
    "stock": 10,
    "seller": "SOME_SELLER_ID"
  }
]
```

## Test Output Examples

### Add Product Test
```
Testing POST /add_product with multiple images
202
{'job_id': 'abc123', 'status': 'processing'}
🔄 0% - Starting product addition...
🔄 5% - Processing 3 images...
🔄 28% - Processing image 1/3...
🔄 33% - Generating embedding for image 1...
🔄 38% - Uploading image 1 to Cloudinary...
🔄 43% - Image 1 processed successfully
✅ Product added successfully! Images: 3, Duplicates: 0, Errors: 0
```

### Search Test
```
Testing POST /search with image
202
{'job_id': 'def456', 'status': 'processing'}
🔄 0% - Starting image search...
🔄 20% - Processing image...
🔄 40% - Generating image embedding...
🔄 60% - Comparing with product database...
🔄 75% - Checking product 15/50...
🔄 95% - Finalizing results...
✅ Search completed!
{
  "matches": [
    {
      "name": "Found Product",
      "similarity": 0.94
    }
  ]
}
```

## Configuration

### Environment Variables
Ensure these are set in your `.env` file:
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGODB_URI=your_mongodb_uri
```

### Test Data Structure
```
images_data/
├── Products/
│   ├── product1_img1.jpg
│   ├── product1_img2.jpg
│   ├── search1.jpg
│   ├── search2.jpg
│   ├── search3.jpg
│   └── search-video1.mp4
└── products.json
```

## Notes
- All operations are processed asynchronously with real-time progress updates
- Progress data is stored in Redis with 1-hour TTL
- The script automatically detects job types and uses appropriate progress endpoints
- Cloudinary is used for image storage and hosting
- Windows-compatible Celery configuration is used (`--pool=solo`)
- Test results include detailed progress tracking and error reporting

## Troubleshooting

### Common Issues
1. **Redis Connection**: Ensure Redis is running for progress tracking
2. **Celery Worker**: Make sure the worker is running with `--pool=solo` on Windows
3. **File Paths**: Verify all test images and videos exist in the correct paths
4. **Environment**: Check that all required environment variables are set

### Debug Mode
For detailed debugging, check the server logs for:
- Celery worker status and task execution
- Redis connection and progress updates
- API endpoint responses and errors

---
For more advanced testing or automation, modify `api_test.py` as needed! 