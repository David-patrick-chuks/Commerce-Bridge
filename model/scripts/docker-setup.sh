#!/bin/bash

# Taja AI Model Docker Setup Script
# This script sets up the Docker environment for the Taja AI model

set -e

echo "🚀 Setting up Taja AI Model Docker Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if .env file exists
setup_env() {
    print_status "Setting up environment variables..."
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_warning "Created .env file from .env.example"
            print_warning "Please update .env file with your actual configuration values"
        else
            print_error ".env.example file not found"
            exit 1
        fi
    else
        print_success ".env file already exists"
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p logs
    mkdir -p images_data/Products
    mkdir -p ssl
    
    print_success "Directories created"
}

# Build Docker images
build_images() {
    print_status "Building Docker images..."
    
    docker-compose build
    
    print_success "Docker images built successfully"
}

# Start services
start_services() {
    print_status "Starting services..."
    
    docker-compose up -d
    
    print_success "Services started successfully"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for Redis
    print_status "Waiting for Redis..."
    until docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do
        sleep 2
    done
    print_success "Redis is ready"
    
    # Wait for API
    print_status "Waiting for API..."
    until curl -f http://localhost:8000/health > /dev/null 2>&1; do
        sleep 5
    done
    print_success "API is ready"
    
    # Wait for Flower
    print_status "Waiting for Flower..."
    until curl -f http://localhost:5555 > /dev/null 2>&1; do
        sleep 5
    done
    print_success "Flower is ready"
}

# Show service status
show_status() {
    print_status "Service Status:"
    docker-compose ps
    
    echo ""
    print_status "Service URLs:"
    echo "  API: http://localhost:8000"
    echo "  API Docs: http://localhost:8000/docs"
    echo "  Flower Monitoring: http://localhost:5555"
    echo "  Redis: localhost:6379"
}

# Main execution
main() {
    echo "🐳 Taja AI Model Docker Setup"
    echo "=============================="
    
    check_docker
    setup_env
    create_directories
    build_images
    start_services
    wait_for_services
    show_status
    
    echo ""
    print_success "Setup completed successfully!"
    echo ""
    print_status "Next steps:"
    echo "  1. Update .env file with your configuration"
    echo "  2. Add your product images to images_data/Products/"
    echo "  3. Run tests: python test/api_test.py"
    echo "  4. Monitor services: docker-compose logs -f"
    echo ""
    print_status "Useful commands:"
    echo "  docker-compose up -d          # Start services"
    echo "  docker-compose down           # Stop services"
    echo "  docker-compose logs -f        # View logs"
    echo "  docker-compose restart        # Restart services"
}

# Run main function
main "$@" 