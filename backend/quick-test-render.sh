#!/bin/bash

echo "🧪 Quick Test for Render Deployment"
echo "===================================="
echo ""
echo "Enter your Render URL (e.g., https://sitara-hotel-backend.onrender.com):"
read BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo "❌ No URL provided"
    exit 1
fi

echo ""
echo "Testing: $BACKEND_URL"
echo ""

# Test health endpoint
echo "1️⃣ Testing health endpoint..."
curl -s "$BACKEND_URL/actuator/health" || echo "Failed to connect"
echo ""
echo ""

# Test registration
echo "2️⃣ Testing registration..."
curl -X POST "$BACKEND_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sitara.com",
    "name": "Admin User",
    "phoneNumber": "1234567890",
    "password": "admin123",
    "role": "ADMIN"
  }'
echo ""
echo ""

# Test login
echo "3️⃣ Testing login..."
curl -X POST "$BACKEND_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sitara.com",
    "password": "admin123"
  }'
echo ""
echo ""

echo "✅ Tests complete!"
echo ""
echo "If you see JSON responses above, your deployment is working! 🎉"

