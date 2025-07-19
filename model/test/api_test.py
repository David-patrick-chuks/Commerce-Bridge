import requests
import os
import json
import time

CLIP_SERVER_URL = "http://localhost:8000"
PRODUCTS_JSON = os.path.join("images_data", "products.json")
SEARCH_IMAGES = [
    os.path.join("images_data", "Products", "search1.jpg"),
    os.path.join("images_data", "Products", "search2.jpg"),
    os.path.join("images_data", "Products", "search3.jpg"),
]
SEARCH_VIDEO = os.path.join("images_data", "Products", "search-video1.mp4")

# Load product data from products.json
with open(PRODUCTS_JSON, "r") as f:
    PRODUCTS = json.load(f)

def test_health():
    print("\nTesting GET /")
    resp = requests.get(f"{CLIP_SERVER_URL}/")
    print(resp.status_code, resp.text)

    print("\nTesting GET /health")
    resp = requests.get(f"{CLIP_SERVER_URL}/health")
    print(resp.status_code, resp.text)

    print("\nTesting GET /metrics")
    resp = requests.get(f"{CLIP_SERVER_URL}/metrics")
    print(resp.status_code)
    print(resp.text[:300] + ("..." if len(resp.text) > 300 else ""))

def poll_job_result(job_id, job_type="search", max_wait=60):
    """Poll for job result with progress updates"""
    start_time = time.time()
    last_progress = -1
    last_message = ""
    
    # Determine the progress endpoint based on job type
    if job_type == "add_product":
        progress_url = f"{CLIP_SERVER_URL}/add_product/progress/{job_id}"
        status_url = f"{CLIP_SERVER_URL}/add_product/job/{job_id}"
    else:
        progress_url = f"{CLIP_SERVER_URL}/search/progress/{job_id}"
        status_url = f"{CLIP_SERVER_URL}/search/job/{job_id}"
    
    while time.time() - start_time < max_wait:
        try:
            # Get progress first
            progress_response = requests.get(progress_url)
            if progress_response.status_code == 200:
                progress_data = progress_response.json()
                current_progress = progress_data.get("progress", 0)
                message = progress_data.get("message", "")
                
                # Print if progress or message changed
                if current_progress != last_progress or message != last_message:
                    if current_progress == -1:
                        print(f"❌ {message}")
                        return None
                    elif current_progress == 100:
                        print(f"✅ {message}")
                    else:
                        print(f"🔄 {current_progress}% - {message}")
                    last_progress = current_progress
                    last_message = message
            
            # Check job status
            response = requests.get(status_url)
            if response.status_code == 200:
                result = response.json()
                
                if result["status"] == "completed":
                    print(f"Job completed:")
                    print(json.dumps(result["result"], indent=2))
                    return result["result"]
                elif result["status"] == "failed":
                    print(f"Job failed:")
                    print(json.dumps(result, indent=2))
                    return None
                elif result["status"] == "processing":
                    # Continue polling
                    pass
                else:
                    print(f"Job status: {result['status']}")
            
            time.sleep(0.5)  # Poll every 0.5 seconds for more frequent updates
            
        except requests.exceptions.RequestException as e:
            print(f"Error polling job: {e}")
            time.sleep(1)
    
    print(f"Timeout waiting for job result after {max_wait} seconds")
    return None

def add_all_products():
    print("\nTesting POST /add_product for all products in products.json")
    for product in PRODUCTS:
        files = [("images", (os.path.basename(img), open(img, "rb"), "image/jpeg")) for img in product["image"]]
        product_data = {
            "name": product["name"],
            "price": product["price"],
            "description": product["description"],
            "category": product["category"],
        }
        resp = requests.post(f"{CLIP_SERVER_URL}/add_product", files=files, data=product_data)
        print(f"Add product '{product['name']}':", resp.status_code, resp.text)
        try:
            resp_json = resp.json()
            if "job_id" in resp_json:
                poll_job_result(resp_json["job_id"], job_type="add_product")
        except Exception:
            print(resp.text)

def search_with_images():
    print("\nTesting POST /search with search images")
    for search_img in SEARCH_IMAGES:
        print(f"\nSearching with {search_img}")
        with open(search_img, "rb") as img_file:
            search_resp = requests.post(
                f"{CLIP_SERVER_URL}/search",
                files={"image": (os.path.basename(search_img), img_file, "image/jpeg")},
                data={}
            )
        print(search_resp.status_code)
        try:
            resp_json = search_resp.json()
            print(resp_json)
            if "job_id" in resp_json:
                poll_job_result(resp_json["job_id"])
        except Exception:
            print(search_resp.text)

def search_with_queries():
    print("\nTesting POST /search with text queries only")
    queries = [
        "cap",
        "fan",
        "t-shirt",
        "eagle"
    ]
    for q in queries:
        print(f"\nSearching with query: '{q}'")
        resp = requests.post(
            f"{CLIP_SERVER_URL}/search",
            data={"query": q}
        )
        print(resp.status_code)
        try:
            resp_json = resp.json()
            print(resp_json)
            if "job_id" in resp_json:
                poll_job_result(resp_json["job_id"])
        except Exception:
            print(resp.text)

def search_with_image_and_query():
    print("\nTesting POST /search with both image and text query")
    test_cases = [
        (SEARCH_IMAGES[0], "eagle tshirt"),
        # (SEARCH_IMAGES[1], "t-shirt"),
        # (SEARCH_IMAGES[2], "wrist-watch")
    ]
    for img_path, query in test_cases:
        print(f"\nSearching with image: {img_path} and query: '{query}'")
        with open(img_path, "rb") as img_file:
            search_resp = requests.post(
                f"{CLIP_SERVER_URL}/search",
                files={"image": (os.path.basename(img_path), img_file, "image/jpeg")},
                data={"query": query}
            )
        print(search_resp.status_code)
        try:
            resp_json = search_resp.json()
            print(resp_json)
            if "job_id" in resp_json:
                poll_job_result(resp_json["job_id"])
        except Exception:
            print(search_resp.text)

def search_with_video():
    print(f"\nTesting POST /search with video: {SEARCH_VIDEO}")
    with open(SEARCH_VIDEO, "rb") as video_file:
        search_resp = requests.post(
            f"{CLIP_SERVER_URL}/search",
            files={"video": (os.path.basename(SEARCH_VIDEO), video_file, "video/mp4")},
            data={}
        )
    print(search_resp.status_code)
    try:
        resp_json = search_resp.json()
        print(resp_json)
        if "job_id" in resp_json:
            poll_job_result(resp_json["job_id"])
    except Exception:
        print(search_resp.text)

if __name__ == "__main__":
    # test_health()
    # add_all_products()
    # search_with_images()
    # search_with_queries()
    search_with_image_and_query()
    search_with_video() 