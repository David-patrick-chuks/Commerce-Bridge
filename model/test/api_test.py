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

def poll_job(job_id, timeout=60, job_type="search"):
    if job_type == "add_product":
        url = f"{CLIP_SERVER_URL}/add_product/job/{job_id}"
    else:
        url = f"{CLIP_SERVER_URL}/search/job/{job_id}"
    print(f"Polling for job result (job_id={job_id}, type={job_type})...")
    for _ in range(timeout):
        job_resp = requests.get(url)
        job_json = job_resp.json()
        if job_json.get("status") == "completed":
            print("Job completed:")
            print(json.dumps(job_json["result"], indent=2))
            return job_json["result"]
        elif job_json.get("status") == "failed":
            print("Job failed:")
            print(job_json)
            return None
        else:
            print(f"Job status: {job_json.get('status')}, waiting...")
            time.sleep(1)
    print("Timeout waiting for job result.")
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
                poll_job(resp_json["job_id"], job_type="add_product")
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
                poll_job(resp_json["job_id"])
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
                poll_job(resp_json["job_id"])
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
                poll_job(resp_json["job_id"])
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
            poll_job(resp_json["job_id"])
    except Exception:
        print(search_resp.text)

if __name__ == "__main__":
    # test_health()
    # add_all_products()
    # search_with_images()
    # search_with_queries()
    search_with_image_and_query()
    search_with_video() 