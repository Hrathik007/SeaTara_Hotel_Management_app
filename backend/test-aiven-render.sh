#!/bin/bash

echo "🧪 Testing Aiven MySQL + Render Backend"
echo "========================================"
echo ""

# Replace with your actual Render URL
BACKEND_URL="YOUR-RENDER-URL-HERE"

if [ "$BACKEND_URL" = "YOUR-RENDER-URL-HERE" ]; then
    echo "⚠️  Please edit this file and replace YOUR-RENDER-URL-HERE with your actual Render URL"
    echo ""
    echo "Example: BACKEND_URL=\"https://sitara-hotel-backend.onrender.com\""
    exit 1
fi

echo "Testing backend at: $BACKEND_URL"
echo ""

# Test 1: Health Check
echo "1️⃣  Testing Health Endpoint..."
echo "GET $BACKEND_URL/actuator/health"
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/actuator/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
BODY=$(echo "$HEALTH_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Health check passed!"
    echo "Response: $BODY"
else
    echo "❌ Health check failed with status: $HTTP_CODE"
    echo "Response: $BODY"
fi
echo ""
echo ""

# Test 2: Register Admin
echo "2️⃣  Registering Admin User..."
echo "POST $BACKEND_URL/auth/register"
REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sitara.com",
    "name": "Admin User",
    "phoneNumber": "1234567890",
    "password": "admin123",
    "role": "ADMIN"
  }')

HTTP_CODE=$(echo "$REGISTER_RESPONSE" | tail -n1)
BODY=$(echo "$REGISTER_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    echo "✅ Registration successful!"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo "⚠️  Registration returned status: $HTTP_CODE"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
fi
echo ""
echo ""

# Test 3: Login
echo "3️⃣  Testing Login..."
echo "POST $BACKEND_URL/auth/login"
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sitara.com",
    "password": "admin123"
  }')

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
BODY=$(echo "$LOGIN_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Login successful!"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"

    # Extract token if present
    TOKEN=$(echo "$BODY" | jq -r '.token // .data.token // empty' 2>/dev/null)
    if [ ! -z "$TOKEN" ]; then
        echo ""
        echo "🔑 JWT Token received (first 50 chars):"
        echo "${TOKEN:0:50}..."
    fi
else
    echo "❌ Login failed with status: $HTTP_CODE"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
fi
echo ""
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All tests completed!"
echo ""
echo "If you see success messages above, your deployment is working! 🎉"
echo ""
echo "Next step: Configure your frontend to use:"
echo "API_URL=$BACKEND_URL"
# Deploy MySQL on Aiven + Backend on Render - Complete Guide

## 🎯 DEPLOYMENT PLAN

1. **Aiven** - MySQL Database (FREE tier available)
2. **Render** - Backend Web Service (FREE tier available)

---

## PART 1: DEPLOY MYSQL ON AIVEN (5 minutes)

### Step 1: Sign Up on Aiven

1. Go to: https://console.aiven.io/signup
2. Sign up with your email or GitHub
3. Verify your email

### Step 2: Create MySQL Service

1. After login, click **"Create Service"**
2. Select **"MySQL"**
3. Choose **"Free Plan"** (look for the FREE label)
   - Cloud: Any region (choose closest to you)
   - Plan: **Hobbyist** or **Free tier**
4. Service name: `sitara-hotel-mysql`
5. Click **"Create Service"**

⏱️ Wait 2-3 minutes for MySQL to start...

### Step 3: Get Connection Details

1. Click on your MySQL service
2. Go to **"Overview"** tab
3. You'll see connection information:

```
Host: sitara-hotel-mysql-your-project.aivencloud.com
Port: 12345
User: avnadmin
Password: AVNS_xxxxxxxxxxx
Database: defaultdb
SSL Mode: REQUIRED
```

4. **IMPORTANT:** Copy these values! You'll need them for Render.

### Step 4: Get the MySQL URI

Scroll down to find the **"Service URI"** - it looks like:

```
mysql://avnadmin:AVNS_password@host:port/defaultdb?ssl-mode=REQUIRED
```

Copy this entire URI!

---

## PART 2: DEPLOY BACKEND ON RENDER (5 minutes)

### Step 1: Sign Up on Render

1. Go to: https://render.com
2. Click **"Get Started"**
3. Sign up with **GitHub** (easiest)
4. Authorize Render

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository:
   - Click **"Configure account"** if needed
   - Select: **SeaTara_Hotel_Management_app**
3. Click **"Connect"**

### Step 3: Configure Service

**Basic Settings:**
- Name: `sitara-hotel-backend`
- Region: Choose closest to you
- Branch: `main`
- Runtime: **Docker**
- Instance Type: **Free**

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables one by one:

**Variable 1:**
```
Key: SPRING_PROFILES_ACTIVE
Value: prod
```

**Variable 2:**
```
Key: DATABASE_URL
Value: [Paste your Aiven MySQL URI here]
```

Example:
```
mysql://avnadmin:AVNS_xxxxxxxxxxx@sitara-hotel-mysql-xxx.aivencloud.com:12345/defaultdb?ssl-mode=REQUIRED
```

**Variable 3:**
```
Key: SPRING_DATASOURCE_URL
Value: jdbc:mysql://[AIVEN_HOST]:[PORT]/defaultdb?useSSL=true&requireSSL=true&serverTimezone=UTC
```

Replace [AIVEN_HOST] and [PORT] with your Aiven values.

Example:
```
jdbc:mysql://sitara-hotel-mysql-xxx.aivencloud.com:12345/defaultdb?useSSL=true&requireSSL=true&serverTimezone=UTC
```

**Variable 4:**
```
Key: SPRING_DATASOURCE_USERNAME
Value: avnadmin
```

**Variable 5:**
```
Key: SPRING_DATASOURCE_PASSWORD
Value: [Your Aiven MySQL password]
```

**Variable 6:**
```
Key: JWT_SECRET
Value: lxp8L0y7eotsrZ2atleYIar4Cf/ojLBRsyg8o+39IGIlvQN2Gw1I/COoLcrTgdJaFWQcguC4Ug1YBIGl7G1B4g==
```

**Variable 7:**
```
Key: PORT
Value: 4040
```

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repository
   - Build Docker image
   - Deploy the app

⏱️ Wait 3-5 minutes for deployment...

### Step 6: Get Your Backend URL

Once deployed, you'll get a URL like:
```
https://sitara-hotel-backend.onrender.com
```

---

## PART 3: TEST YOUR DEPLOYMENT

### Test Health Check

```bash
curl https://sitara-hotel-backend.onrender.com/actuator/health
```

Expected response:
```json
{"status":"UP"}
```

### Test Registration

```bash
curl -X POST https://sitara-hotel-backend.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sitara.com",
    "name": "Admin User",
    "phoneNumber": "1234567890",
    "password": "admin123",
    "role": "ADMIN"
  }'
```

### Test Login

```bash
curl -X POST https://sitara-hotel-backend.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sitara.com",
    "password": "admin123"
  }'
```

You should get a JWT token back!

---

## 💰 PRICING

### Aiven MySQL (Free Tier)
- ✅ **FREE Plan Available**
- 1 GB RAM
- 5 GB Storage
- Single node
- **Perfect for development!**

### Render (Free Tier)
- ✅ **FREE Plan Available**
- 512 MB RAM
- **Limitation:** Spins down after 15 minutes of inactivity
- **First request after sleep:** Takes 30-60 seconds to wake up
- **Solution:** Use a uptime monitoring service (I'll show you)

---

## 🚨 IMPORTANT: AIVEN SSL REQUIREMENT

Aiven requires SSL connections. I need to update your application.properties to handle this.

The configuration I'll create will:
- Enable SSL for Aiven connection
- Support both local development and production
- Handle Aiven's SSL certificates automatically

---

## 🔄 KEEP RENDER FREE TIER AWAKE

Render free tier sleeps after 15 min. Use one of these:

### Option 1: UptimeRobot (Recommended)
1. Go to https://uptimerobot.com
2. Sign up (free)
3. Add monitor: Your Render URL
4. Check interval: Every 5 minutes
5. **Stays awake 24/7!**

### Option 2: Cron-job.org
1. Go to https://cron-job.org
2. Create job to ping your health endpoint every 5 minutes

---

## 📱 CONNECT FRONTEND

After deployment, add this to your frontend .env:

```env
REACT_APP_API_URL=https://sitara-hotel-backend.onrender.com
VITE_API_URL=https://sitara-hotel-backend.onrender.com
```

---

## 🐛 TROUBLESHOOTING

### Database Connection Failed
- Check Aiven MySQL is running (green status)
- Verify all environment variables are correct
- Make sure you copied the full password (no spaces)
- Check SSL is enabled in connection string

### Render Build Failed
- Check Dockerfile exists
- View build logs in Render dashboard
- Make sure GitHub repository is accessible

### App Crashes
- Check logs in Render dashboard
- Look for database connection errors
- Verify JWT_SECRET is set

---

## ✅ CHECKLIST

Before you start:
- [ ] Aiven account created
- [ ] Render account created
- [ ] GitHub repository accessible
- [ ] Ready to copy environment variables

---

## 🎉 NEXT STEPS

1. **Start with Aiven** (create MySQL database)
2. **Then Render** (deploy backend)
3. **Test the endpoints**
4. **Set up UptimeRobot** (keep it awake)
5. **Connect your frontend**

---

Let's start! Tell me when you've created your Aiven MySQL database and I'll help you with the exact connection settings!

