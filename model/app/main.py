from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse
from app.api.add_product import router as add_product_router
from app.api.search import router as search_router
from app.core.db import get_db
from app.core.clip_utils import initialize_clip
from app.core.config import settings
import logging
import time
import sys

# Configure logging based on settings
def setup_logging():
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s [%(levelname)s] %(message)s",
    )

# Create FastAPI app with configuration
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered product search and management API",
    version="1.0.0",
    debug=settings.DEBUG,
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
)

# Metrics storage
metrics = {
    "requests_total": 0,
    "errors_total": 0,
    "start_time": time.time(),
}

@app.on_event("startup")
def on_startup():
    setup_logging()
    logging.info(f"{settings.PROJECT_NAME} server starting up...")
    logging.info(f"Environment: {settings.ENVIRONMENT}")
    logging.info(f"Debug mode: {settings.DEBUG}")
    
    # Preload CLIP model
    try:
        model, preprocess = initialize_clip()
        if model is None or preprocess is None:
            raise RuntimeError("CLIP model failed to load.")
        logging.info(f"CLIP model '{settings.CLIP_MODEL_NAME}' loaded successfully.")
        logging.info(f"Embedding dimension: {settings.EMBEDDING_DIMENSION}")
    except Exception as e:
        logging.error(f"Failed to load CLIP model: {e}")
        sys.exit(1)
    
    # Test MongoDB connection
    try:
        db = get_db()
        db.command("ping")
        logging.info(f"MongoDB connection successful. Database: {settings.MONGO_DB}")
    except Exception as e:
        logging.error(f"Failed to connect to MongoDB: {e}")
        sys.exit(1)
    
    # Log configuration summary
    logging.info(f"File upload max size: {settings.MAX_FILE_SIZE // (1024*1024)}MB")
    logging.info(f"Allowed image types: {', '.join(settings.ALLOWED_IMAGE_TYPES)}")
    logging.info(f"Allowed video types: {', '.join(settings.ALLOWED_VIDEO_TYPES)}")
    logging.info(f"Similarity threshold: {settings.SIMILARITY_THRESHOLD}")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    metrics["requests_total"] += 1
    if settings.DEBUG:
        logging.info(f"Incoming request: {request.method} {request.url.path}")
    try:
        response = await call_next(request)
        return response
    except Exception as exc:
        metrics["errors_total"] += 1
        logging.exception(f"Error handling request: {request.method} {request.url.path}")
        raise

app.include_router(add_product_router, prefix=settings.API_V1_STR)
app.include_router(search_router, prefix=settings.API_V1_STR)

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    metrics["errors_total"] += 1
    logging.warning(f"HTTPException: {exc.status_code} {exc.detail} on {request.method} {request.url.path}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"status": "error", "message": exc.detail},
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    metrics["errors_total"] += 1
    logging.exception(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"status": "error", "message": "Internal server error."},
    )

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "project": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "version": "1.0.0"
    }

@app.get("/health", tags=["Health"], summary="Health check for API, DB, and CLIP model")
def full_health_check():
    status = {
        "api": "ok",
        "project": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT
    }
    
    # Check MongoDB
    try:
        db = get_db()
        db.command("ping")
        status["mongodb"] = "ok"
    except Exception as e:
        status["mongodb"] = f"error: {str(e)}"
    
    # Check CLIP model
    try:
        model, preprocess = initialize_clip()
        if model is not None and preprocess is not None:
            status["clip_model"] = "ok"
            status["clip_model_name"] = settings.CLIP_MODEL_NAME
            status["embedding_dimension"] = settings.EMBEDDING_DIMENSION
        else:
            status["clip_model"] = "not loaded"
    except Exception as e:
        status["clip_model"] = f"error: {str(e)}"
    
    # Check Redis if enabled
    if settings.ENABLE_METRICS:
        try:
            import redis
            redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
            redis_client.ping()
            status["redis"] = "ok"
        except Exception as e:
            status["redis"] = f"error: {str(e)}"
    
    return status

@app.get("/config", tags=["Configuration"], summary="Get current application configuration")
def get_config():
    """Get current application configuration (without sensitive data)"""
    return {
        "project_name": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "debug": settings.DEBUG,
        "log_level": settings.LOG_LEVEL,
        "api_prefix": settings.API_V1_STR,
        "max_file_size_mb": settings.MAX_FILE_SIZE // (1024*1024),
        "allowed_image_types": settings.ALLOWED_IMAGE_TYPES,
        "allowed_video_types": settings.ALLOWED_VIDEO_TYPES,
        "clip_model_name": settings.CLIP_MODEL_NAME,
        "embedding_dimension": settings.EMBEDDING_DIMENSION,
        "similarity_threshold": settings.SIMILARITY_THRESHOLD,
        "enable_metrics": settings.ENABLE_METRICS,
        "enable_health_checks": settings.ENABLE_HEALTH_CHECKS,
    }

@app.get("/metrics", tags=["Metrics"], summary="Prometheus-style metrics for monitoring")
def metrics_endpoint():
    if not settings.ENABLE_METRICS:
        raise HTTPException(status_code=404, detail="Metrics endpoint disabled")
    
    uptime = int(time.time() - metrics["start_time"])
    prometheus_metrics = f"""
# HELP {settings.PROJECT_NAME.lower()}_requests_total Total HTTP requests
# TYPE {settings.PROJECT_NAME.lower()}_requests_total counter
{settings.PROJECT_NAME.lower()}_requests_total {metrics["requests_total"]}
# HELP {settings.PROJECT_NAME.lower()}_errors_total Total HTTP errors
# TYPE {settings.PROJECT_NAME.lower()}_errors_total counter
{settings.PROJECT_NAME.lower()}_errors_total {metrics["errors_total"]}
# HELP {settings.PROJECT_NAME.lower()}_uptime_seconds Server uptime in seconds
# TYPE {settings.PROJECT_NAME.lower()}_uptime_seconds gauge
{settings.PROJECT_NAME.lower()}_uptime_seconds {uptime}
"""
    return PlainTextResponse(prometheus_metrics.strip(), media_type="text/plain") 