from celery import Celery
from app.core.config import settings

celery_app = Celery("model")

celery_app.conf.update(
    broker_url=settings.REDIS_URL,
    result_backend=settings.REDIS_URL,
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    worker_disable_rate_limits=True,
    # Windows-specific settings
    worker_pool="solo",  # Use solo pool instead of prefork on Windows
    worker_concurrency=1,  # Single worker process
    task_always_eager=False,
    task_eager_propagates=True,
)

# Import task modules after celery_app is defined to avoid circular import
from app.tasks import search_tasks, product_tasks 