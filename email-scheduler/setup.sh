#!/bin/bash

echo "🚀 Email Scheduler - Setup Script"
echo "=================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Start Docker containers
echo "📦 Starting PostgreSQL and Redis..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Setup backend
echo ""
echo "🔧 Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your configuration:"
    echo "   - Ethereal Email credentials (https://ethereal.email)"
    echo "   - Google OAuth credentials"
fi

echo "📦 Installing backend dependencies..."
npm install

cd ..

# Setup frontend
echo ""
echo "🎨 Setting up frontend..."
cd frontend

echo "📦 Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your configuration"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start worker: cd backend && npm run worker:dev (in another terminal)"
echo "4. Start frontend: cd frontend && npm run dev (in another terminal)"
echo ""
echo "Backend will run on: http://localhost:3000"
echo "Frontend will run on: http://localhost:3001"
echo ""
echo "📚 See README.md for detailed documentation"
