#!/bin/bash

# Taja AI Model - Docker Setup Script
# This script sets up the complete Docker environment for Taja AI Model

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Taja AI Model - Docker Setup${NC}"
echo "=================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found!${NC}"
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created from .env.example${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env file with your actual configuration values:${NC}"
        echo -e "${YELLOW}   - MONGO_URI (MongoDB connection string)${NC}"
        echo -e "${YELLOW}   - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET${NC}"
        echo -e "${YELLOW}   - SECRET_KEY (for security)${NC}"
        echo -e "${YELLOW}   - Other configuration as needed${NC}"
        echo ""
        echo -e "${YELLOW}Press Enter to continue after editing .env file...${NC}"
        read -r
    else
        echo -e "${RED}❌ .env.example file not found!${NC}"
        echo -e "${RED}Please create a .env file with the required environment variables.${NC}"
        exit 1
    fi
fi

# Validate required environment variables
echo -e "${BLUE}🔍 Validating environment configuration...${NC}"

# Check for required variables
required_vars=("MONGO_URI" "CLOUDINARY_CLOUD_NAME" "CLOUDINARY_API_KEY" "CLOUDINARY_API_SECRET" "SECRET_KEY")
missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env || grep -q "^${var}=$" .env || grep -q "^${var}=your-" .env; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing or invalid required environment variables:${NC}"
    for var in "${missing_vars[@]}"; do
        echo -e "${RED}   - $var${NC}"
    done
    echo -e "${YELLOW}Please update your .env file with valid values.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment configuration validated${NC}"

# Check Docker and Docker Compose
echo -e "${BLUE}🔍 Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo -e "${YELLOW}Please install Docker first: https://docs.docker.com/get-docker/${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed!${NC}"
    echo -e "${YELLOW}Please install Docker Compose first: https://docs.docker.com/compose/install/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are available${NC}"

# Build and start services
echo -e "${BLUE}🏗️  Building Docker images...${NC}"
docker-compose build

echo -e "${BLUE}🚀 Starting services...${NC}"
docker-compose up -d

# Wait for services to be ready
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check service health
echo -e "${BLUE}🔍 Checking service health...${NC}"

# Check API health
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API service is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  API service health check failed (may still be starting)${NC}"
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis service is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  Redis service health check failed${NC}"
fi

# Check Celery worker
if docker-compose exec -T worker celery -A app.worker.celery_app inspect ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Celery worker is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  Celery worker health check failed (may still be starting)${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Taja AI Model is now running!${NC}"
echo "=================================="
echo -e "${BLUE}📊 Service URLs:${NC}"
echo -e "${GREEN}   API:${NC} http://localhost:8000"
echo -e "${GREEN}   API Docs:${NC} http://localhost:8000/docs"
echo -e "${GREEN}   Health Check:${NC} http://localhost:8000/health"
echo -e "${GREEN}   Configuration:${NC} http://localhost:8000/config"
echo -e "${GREEN}   Metrics:${NC} http://localhost:8000/metrics"
echo -e "${GREEN}   Flower (Celery):${NC} http://localhost:5555"
echo -e "${GREEN}   Redis:${NC} localhost:6379"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo -e "${GREEN}   View logs:${NC} docker-compose logs -f"
echo -e "${GREEN}   Stop services:${NC} docker-compose down"
echo -e "${GREEN}   Restart services:${NC} docker-compose restart"
echo -e "${GREEN}   Rebuild and restart:${NC} docker-compose up -d --build"
echo ""
echo -e "${BLUE}🧪 Testing:${NC}"
echo -e "${GREEN}   Run test script:${NC} python test/api_test.py"
echo -e "${GREEN}   Test health endpoint:${NC} curl http://localhost:8000/health"
echo ""
echo -e "${YELLOW}⚠️  Development Mode:${NC}"
echo -e "${YELLOW}   For development with hot-reload, use:${NC}"
echo -e "${YELLOW}   docker-compose -f docker-compose.dev.yml up -d${NC}"
echo ""
echo -e "${GREEN}🚀 Happy coding!${NC}" 