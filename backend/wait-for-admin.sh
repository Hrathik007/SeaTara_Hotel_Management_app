#!/bin/bash

echo "🔄 Waiting for Render to redeploy and create admin user..."
echo ""
echo "This will:"
echo "1. Wait for deployment to complete (2-3 minutes)"
echo "2. Try to login with admin@sitara.com / admin123"
echo ""

BACKEND_URL="https://sitara-hotel-backend.onrender.com"
MAX_ATTEMPTS=20
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "⏳ Attempt $ATTEMPT/$MAX_ATTEMPTS - Testing login..."

    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "admin@sitara.com",
        "password": "admin123"
      }')

    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n-1)

    if [ "$HTTP_CODE" = "200" ]; then
        echo ""
        echo "✅ SUCCESS! Admin user created and login works!"
        echo ""
        echo "Response:"
        echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
        echo ""
        echo "🎉 You can now login with:"
        echo "   Email: admin@sitara.com"
        echo "   Password: admin123"
        exit 0
    elif [ "$HTTP_CODE" = "403" ] || [ "$HTTP_CODE" = "401" ]; then
        echo "⚠️  Got HTTP $HTTP_CODE - Deployment may still be in progress..."
    else
        echo "⚠️  Got HTTP $HTTP_CODE - Waiting for service to be ready..."
    fi

    if [ $ATTEMPT -lt $MAX_ATTEMPTS ]; then
        echo "   Waiting 15 seconds before retry..."
        sleep 15
    fi

    ATTEMPT=$((ATTEMPT + 1))
done

echo ""
echo "❌ Timeout waiting for deployment"
echo ""
echo "Please:"
echo "1. Go to Render dashboard: https://dashboard.render.com"
echo "2. Check your 'sitara-hotel-backend' service"
echo "3. Look at the deployment logs"
echo "4. Wait for 'Deploy live' status"
echo "5. Then try login again"

