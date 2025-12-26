#!/bin/bash

# GeekyGoose Compliance Setup Script
# This script helps you get started with GeekyGoose Compliance quickly

set -e

echo "🦆 Welcome to GeekyGoose Compliance Setup!"
echo "=========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first:"
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. You can customize it if needed."
else
    echo "✅ .env file already exists"
fi

# Pull images and start services
echo "🚀 Starting GeekyGoose Compliance services..."
echo "   This may take a few minutes on first run..."

# Build and start services
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Some services failed to start. Check logs with:"
    echo "   docker-compose logs"
    exit 1
fi

echo "✅ Services are running"

# Initialize database
echo "🗄️ Initializing database..."
if docker-compose exec -T api python create_tables.py; then
    echo "✅ Database tables created"
else
    echo "❌ Failed to create database tables"
    exit 1
fi

# Seed database with Essential Eight framework
echo "🌱 Seeding database with Essential Eight framework..."
if docker-compose exec -T api python seed_database.py; then
    echo "✅ Database seeded with Essential Eight controls"
else
    echo "❌ Failed to seed database"
    exit 1
fi

# Check service health
echo "🏥 Checking service health..."

# Check API health
if curl -sf http://localhost:8000/health > /dev/null; then
    echo "✅ API is healthy"
else
    echo "❌ API is not responding"
    exit 1
fi

# Check frontend
if curl -sf http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not responding"
    exit 1
fi

echo ""
echo "🎉 GeekyGoose Compliance is ready!"
echo "=================================="
echo ""
echo "📱 Web Interface:     http://localhost:3000"
echo "🔧 API Documentation: http://localhost:8000/docs"
echo "💾 MinIO Console:     http://localhost:9001"
echo ""
echo "🚀 Getting Started:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Go to Documents → Upload your compliance evidence"
echo "3. Go to Controls → Link evidence to controls"
echo "4. Run AI scans to analyze compliance"
echo "5. View Reports for compliance overview"
echo ""
echo "📖 Next Steps:"
echo "• Configure AI settings (Settings → AI)"
echo "• Upload your first policy document"
echo "• Run a compliance scan on Essential Eight controls"
echo "• Export your first compliance report"
echo ""
echo "❓ Need Help?"
echo "• Documentation: README.md"
echo "• Issues: https://github.com/yourusername/geekygoose-compliance/issues"
echo "• Logs: docker-compose logs"
echo ""
echo "Happy compliance scanning! 🦆"