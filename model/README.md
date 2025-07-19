# Taja AI Model - AI-Powered Product Search

A FastAPI-based AI model service for image, video, and text-based product search using CLIP embeddings and MongoDB.

## 🚀 Features

- **Multi-Modal Search**: Image, video, and text-based product search
- **CLIP AI Model**: State-of-the-art image understanding with configurable models
- **Real-time Progress Tracking**: Monitor search and product addition jobs
- **Redis Caching**: Fast response times with intelligent caching
- **Celery Background Tasks**: Asynchronous processing for heavy workloads
- **File Validation**: Secure file upload with size and type restrictions
- **Comprehensive Product Data**: Support for weight, color, sizes, and key features
- **Comprehensive Monitoring**: Health checks, metrics, and configuration endpoints
- **Docker Ready**: Complete containerization for development and production

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FastAPI API   │    │  Celery Worker  │    │   Redis Cache   │
│   (Port 8000)   │◄──►│   (Background)  │◄──►│   (Port 6379)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MongoDB DB    │    │  Cloudinary     │    │   Flower UI     │
│   (Products)    │    │  (Image Store)  │    │   (Port 5555)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- Python 3.11+
- Docker & Docker Compose
- MongoDB Atlas account
- Cloudinary account
- Redis (included in Docker setup)

## 🛠️ Installation & Setup

### 1. Clone and Setup

```bash
git clone <repository-url>
cd model
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```bash
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGO_DB=commercebridge
MONGO_COLLECTION=products

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security
SECRET_KEY=your-secret-key-here-change-in-production

# AI Model Configuration
CLIP_MODEL_NAME=ViT-L/14
EMBEDDING_DIMENSION=768
SIMILARITY_THRESHOLD=0.7
```

**Optional Configuration:**

```bash
# Application Configuration
ENVIRONMENT=development
DEBUG=1
LOG_LEVEL=info

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=Taja

# File Upload Configuration
MAX_FILE_SIZE=104857600  # 100MB
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
ALLOWED_VIDEO_TYPES=video/mp4,video/avi,video/mov,video/mkv

# Monitoring
ENABLE_METRICS=true
ENABLE_HEALTH_CHECKS=true
```

### 3. Docker Deployment (Recommended)

#### Quick Start with Setup Script

```bash
chmod +x scripts/docker-setup.sh
./scripts/docker-setup.sh
```

#### Manual Docker Setup

**Production:**
```bash
docker-compose up -d
```

**Development (with hot-reload):**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 4. Local Development Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Start Redis (if not using Docker)
redis-server

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Start Celery worker (in another terminal)
celery -A app.worker.celery_app worker --loglevel=info --pool=solo --concurrency=1
```

## 🚀 API Endpoints

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/health` | GET | Comprehensive health check |
| `/config` | GET | View current configuration |
| `/metrics` | GET | Prometheus metrics |
| `/docs` | GET | API documentation |

### Product Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/add_product` | POST | Add new product with images and detailed product information |
| `/api/v1/add_product/job/{job_id}` | GET | Get add product job status |
| `/api/v1/add_product/progress/{job_id}` | GET | Get add product progress |

### Search Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/search` | POST | Search products by image/video/text |
| `/api/v1/search/job/{job_id}` | GET | Get search job status |
| `/api/v1/search/progress/{job_id}` | GET | Get search progress |

## 📦 Product Data Structure

### Required Fields
- `name`: Product name
- `price`: Product price (in cents/smallest currency unit)
- `description`: Product description
- `images`: Array of image files
- `category`: Product category

### Optional Fields
- `weight_kg`: Product weight in kilograms (float)
- `color`: Product color (string, e.g., "Black", "Red", "Assorted")
- `sizes`: Available sizes (array of strings, e.g., ["S", "M", "L"] or ["10", "11", "12"])
- `key_features`: Product features and specifications (array of strings)

### Example Product Data
```json
{
  "name": "Wireless Headphones",
  "price": 9999,
  "description": "High-quality wireless headphones with noise cancellation",
  "category": "Electronics",
  "weight_kg": 0.5,
  "color": "black",
  "sizes": null,
  "key_features": [
    "Noise Cancellation",
    "Bluetooth 5.0",
    "30-hour Battery Life",
    "Quick Charge",
    "Touch Controls"
  ]
}
```

## 🔧 Configuration

### CLIP Model Options

Available CLIP models (set `CLIP_MODEL_NAME` in `.env`):

- `ViT-B/32` - Fast, 512 dimensions
- `ViT-B/16` - Balanced, 512 dimensions  
- `ViT-L/14` - High accuracy, 768 dimensions (default)
- `ViT-L/14@336px` - Highest accuracy, 768 dimensions
- `RN50` - ResNet model, 1024 dimensions

### File Upload Limits

Configure in `.env`:

```bash
MAX_FILE_SIZE=104857600  # 100MB in bytes
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
ALLOWED_VIDEO_TYPES=video/mp4,video/avi,video/mov,video/mkv
```

### Search Threshold

Adjust similarity threshold for search results:

```bash
SIMILARITY_THRESHOLD=0.7  # 0.0 to 1.0 (higher = more strict)
```

## 🐳 Docker Services

### Production Services

- **api**: FastAPI application (port 8000)
- **worker**: Celery background worker
- **redis**: Redis cache and message broker (port 6379)
- **flower**: Celery monitoring UI (port 5555)
- **nginx**: Reverse proxy (optional, ports 80/443)

### Development Services

- **api**: FastAPI with hot-reload
- **worker**: Celery worker with debug logging
- **redis**: Redis with persistence
- **flower**: Celery monitoring

### Management Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# Stop all services
docker-compose down

# Development mode
docker-compose -f docker-compose.dev.yml up -d
```

## 🧪 Testing

### Run Test Script

```bash
python test/api_test.py
```

### Manual Testing

```bash
# Health check
curl http://localhost:8000/health

# Configuration
curl http://localhost:8000/config

# Metrics
curl http://localhost:8000/metrics

# Add product with detailed information
curl -X POST "http://localhost:8000/api/v1/add_product" \
  -F "images=@product1.jpg" \
  -F "name=Test Product" \
  -F "price=9999" \
  -F "description=Test description" \
  -F "category=Electronics" \
  -F "weight_kg=0.5" \
  -F "color=black" \
  -F "key_features=[\"Feature 1\", \"Feature 2\"]"
```

## 📊 Monitoring

### Health Checks

- **API Health**: `GET /health`
- **Redis Health**: Automatic in Docker
- **Celery Health**: Automatic in Docker
- **CLIP Model**: Verified on startup

### Metrics

- Request counts
- Error rates
- Uptime
- Custom business metrics

### Flower Dashboard

Access Celery monitoring at: http://localhost:5555

## 🔒 Security

- File type validation
- File size limits
- Environment variable validation
- Secure defaults
- Non-root Docker containers

## 🚀 Deployment Options

### Docker Compose (Recommended)

```bash
docker-compose up -d
```

### Kubernetes

Use the provided Docker images with your K8s manifests.

### Cloud Platforms

- **AWS**: ECS, EKS
- **Google Cloud**: GKE, Cloud Run
- **Azure**: AKS, Container Instances
- **DigitalOcean**: App Platform, Kubernetes

## 📝 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URI` | ✅ | - | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | ✅ | - | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | - | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | - | Cloudinary API secret |
| `SECRET_KEY` | ✅ | - | Application secret key |
| `REDIS_URL` | ❌ | `redis://localhost:6379/0` | Redis connection URL |
| `MONGO_DB` | ❌ | `commercebridge` | MongoDB database name |
| `MONGO_COLLECTION` | ❌ | `products` | MongoDB collection name |
| `ENVIRONMENT` | ❌ | `development` | Environment (dev/prod) |
| `DEBUG` | ❌ | `0` | Debug mode (0/1) |
| `LOG_LEVEL` | ❌ | `info` | Logging level |
| `API_V1_STR` | ❌ | `/api/v1` | API version prefix |
| `PROJECT_NAME` | ❌ | `Taja` | Project name |
| `MAX_FILE_SIZE` | ❌ | `104857600` | Max file size (bytes) |
| `ALLOWED_IMAGE_TYPES` | ❌ | `image/jpeg,image/png,image/webp` | Allowed image types |
| `ALLOWED_VIDEO_TYPES` | ❌ | `video/mp4,video/avi,video/mov,video/mkv` | Allowed video types |
| `CLIP_MODEL_NAME` | ❌ | `ViT-L/14` | CLIP model to use |
| `EMBEDDING_DIMENSION` | ❌ | `768` | Embedding dimensions |
| `SIMILARITY_THRESHOLD` | ❌ | `0.7` | Search similarity threshold |
| `ENABLE_METRICS` | ❌ | `true` | Enable metrics endpoint |
| `ENABLE_HEALTH_CHECKS` | ❌ | `true` | Enable health checks |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/docs`
- Review the health endpoint at `/health`
- Check the configuration at `/config`
- Monitor Celery tasks at Flower dashboard 