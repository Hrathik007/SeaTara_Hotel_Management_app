# 🚂 Deploy to Railway - Step by Step Guide

## What is Railway?
- **FREE $5 credit/month** (enough for small apps)
- **MySQL database included** (no PostgreSQL needed!)
- **Auto-deploys** from GitHub on every push
- **Super simple** - no complex configuration

---

## 📋 Step-by-Step Deployment

### **Step 1: Push Code to GitHub**

```bash
cd "/Users/hemanth/Documents/SitaraHotel /backend"

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Railway deployment"

# Create a new repository on GitHub (github.com)
# Then connect and push:
git remote add origin https://github.com/YOUR-USERNAME/sitara-hotel-backend.git
git branch -M main
git push -u origin main
```

---

### **Step 2: Sign Up on Railway**

1. Go to **https://railway.app**
2. Click **"Start a New Project"**
3. Sign in with **GitHub** (easiest way)
4. Authorize Railway to access your repositories

---

### **Step 3: Create MySQL Database**

1. Click **"+ New"** → **"Database"** → **"Add MySQL"**
2. Railway will create a MySQL database automatically
3. Note: Railway will automatically provide these environment variables:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLURL` (full connection string)
   - `DATABASE_URL` (alternative format)

---

### **Step 4: Deploy Your Backend**

1. Click **"+ New"** → **"GitHub Repo"**
2. Select **"sitara-hotel-backend"** (or whatever you named it)
3. Railway will automatically:
   - Detect the Dockerfile
   - Start building
   - Deploy the app

---

### **Step 5: Configure Environment Variables**

1. Click on your deployed service
2. Go to **"Variables"** tab
3. Add these custom variables:

```
SPRING_PROFILES_ACTIVE=railway
JWT_SECRET=your-very-long-random-secret-key-min-64-characters-change-this
```

**Note:** Railway automatically sets MySQL variables, but if you want to set them manually:

```
MYSQLURL=<Railway provides this automatically>
MYSQLUSER=<Railway provides this automatically>
MYSQLPASSWORD=<Railway provides this automatically>
PORT=4040
```

---

### **Step 6: Generate Domain**

1. Go to **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. You'll get a URL like: `https://sitara-hotel-backend.up.railway.app`

---

### **Step 7: Test Your Deployment**

```bash
# Check health
curl https://your-app.up.railway.app/actuator/health

# Test login endpoint
curl -X POST https://your-app.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sitara.com","password":"admin123"}'
```

---

## 🎯 Complete Railway Dashboard Guide

### What You'll See:

1. **Deployments Tab**: See build logs and deployment history
2. **Metrics Tab**: Monitor CPU, RAM, Network usage
3. **Variables Tab**: Manage environment variables
4. **Settings Tab**: Configure domain, replicas, etc.

---

## 📊 How Railway MySQL Works

Railway automatically injects these environment variables:

| Variable | Example | Description |
|----------|---------|-------------|
| `MYSQLHOST` | `containers-us-west-123.railway.app` | Database host |
| `MYSQLPORT` | `3306` | Database port |
| `MYSQLDATABASE` | `railway` | Database name |
| `MYSQLUSER` | `root` | Database user |
| `MYSQLPASSWORD` | `abc123xyz...` | Database password |
| `MYSQLURL` | `jdbc:mysql://host:3306/railway` | Full JDBC URL |

**Your app automatically uses these!** ✅

---

## 🔄 Auto-Deploy on Git Push

Once set up, every time you push to GitHub:

```bash
git add .
git commit -m "Updated feature"
git push
```

Railway will automatically:
1. Detect the push
2. Build the new Docker image
3. Deploy the updated app
4. Zero downtime!

---

## 💰 Pricing (as of 2026)

- **Free Tier**: $5 credit/month
- **Usage**: ~$0.20/day for small app + MySQL
- **Estimated**: 25 days free per month
- **Paid**: $5/month for more resources

---

## 🐛 Troubleshooting

### Build Failed?

```bash
# Check Railway build logs
# Click on deployment → View logs
```

Common issues:
- Java version mismatch → Check Dockerfile uses Java 21
- Missing dependencies → Run `mvn clean install` locally first

### App Crashes?

1. Check **Logs** tab in Railway
2. Look for errors like:
   - Database connection failed
   - JWT_SECRET not set
   - Port binding issues

### Database Connection Failed?

Railway MySQL takes ~30 seconds to start. Wait and retry.

---

## 🎨 Your Backend URLs

After deployment, you'll have:

- **Main URL**: `https://sitara-hotel-backend.up.railway.app`
- **Health Check**: `https://sitara-hotel-backend.up.railway.app/actuator/health`
- **API Endpoints**: 
  - `POST https://your-app.railway.app/auth/login`
  - `POST https://your-app.railway.app/auth/register`
  - `GET https://your-app.railway.app/rooms/all`

---

## 🔐 Security Checklist

✅ Generate a strong JWT_SECRET:
```bash
openssl rand -base64 64
```

✅ Add it to Railway Variables tab

✅ Never commit `.env` files to GitHub

✅ Use Railway's automatic HTTPS (already included)

---

## 📱 Connect Frontend Later

Once deployed, your frontend will use:

```javascript
// In your frontend .env file
REACT_APP_API_URL=https://sitara-hotel-backend.up.railway.app
```

---

## 🚀 Ready to Deploy?

Follow **Step 1** above to push to GitHub, then continue with Step 2!

**Questions? Railway has great docs:** https://docs.railway.app
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "java -jar app.jar",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}

