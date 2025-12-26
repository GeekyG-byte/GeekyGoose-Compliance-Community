#!/bin/bash

# GeekyGoose Compliance Platform Startup Script
echo "Starting GeekyGoose Compliance Platform..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env file exists or OPENAI_API_KEY is set
if [ ! -f .env ] && [ -z "$OPENAI_API_KEY" ]; then
    echo "Warning: No .env file found and OPENAI_API_KEY not set."
    echo "Please create a .env file with OPENAI_API_KEY=your_api_key"
    echo "Or set the environment variable: export OPENAI_API_KEY=your_api_key"
fi

# Start all services
echo "Starting all services with Docker Compose..."
docker-compose up -d

# Wait a moment for services to start
sleep 5

# Show status
echo ""
echo "Service Status:"
docker-compose ps

echo ""
echo "🚀 GeekyGoose Compliance Platform is starting up!"
echo ""
echo "Services will be available at:"
echo "  📊 Web UI:  http://localhost:3000"
echo "  🔌 API:     http://localhost:8000"
echo "  🗄️  MinIO:   http://localhost:9001 (admin: minioadmin/minioadmin123)"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop:      docker-compose down"
echo ""
echo "Your scan results will be available at:"
echo "  GET http://localhost:8000/scans/85ba163b-3801-4d3c-9259-0b03d90eac94"