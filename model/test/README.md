# API Test Script for Taja

This directory contains a standalone API test script (`api_test.py`) for testing your Taja server's endpoints and product/image search functionality.

## Features
- Adds all products from `images_data/products.json` to the server (uploads all images for each product)
- Runs search queries using images `search1.jpg`, `search2.jpg`, `search3.jpg`, a video file `search-video1.mp4`, and text queries in `images_data/Products/`, all via async queue
- Prints results for health, metrics, add, and search endpoints
- Uses Cloudinary for image storage (see backend requirements)

## Requirements
- Python 3.8+
- `requests` and `cloudinary` Python packages
- Taja server running (e.g., `uvicorn app.main:app --host 0.0.0.0 --port 8000`)
- All product images, search images, and the test video (`search-video1.mp4`) present in `images_data/Products/`
- `products.json` in `images_data/` with product definitions (see example below)

## Usage
1. **Start your Taja server:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
2. **Run the test script from the project directory:**
   ```bash
   python test/api_test.py
   ```
3. **Review the output:**
   - The script will print the results of each API call and search. For all search types, it polls the job status endpoint until results are ready.

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

## Notes
- The script will upload all images for each product to Cloudinary (if configured in the backend).
- The search tests use the images `search1.jpg`, `search2.jpg`, `search3.jpg`, and the video `search-video1.mp4` in `images_data/Products/`.
- You can add more products or search images by updating `products.json` and the `SEARCH_IMAGES` list in the script.
- The script now tests image, video, and text search functionality. All search requests are processed asynchronously via a queue, and the script polls for job completion/results. You can add more test videos or queries by updating the relevant variables in the script.

---
For more advanced testing or automation, modify `api_test.py` as needed! 