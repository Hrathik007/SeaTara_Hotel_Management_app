# 🚀 Quick Start Guide - Email Scheduler

Get the Email Scheduler running in under 5 minutes!

## Prerequisites Check

Ensure you have:
- ✅ Node.js 18+ (`node --version`)
- ✅ npm (`npm --version`)
- ✅ Docker (`docker --version`)
- ✅ Docker Compose (`docker-compose --version`)

## Step 1: Get Ethereal Email Credentials (2 minutes)

1. Visit https://ethereal.email
2. Click **"Create Ethereal Account"**
3. Copy the SMTP credentials shown (keep this tab open)

Example credentials you'll see:
```
Host: smtp.ethereal.email
Port: 587
User: your-user@ethereal.email
Pass: your-password
```

## Step 2: Get Google OAuth Credentials (3 minutes)

1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
7. Copy **Client ID** and **Client Secret**

## Step 3: Start Infrastructure (30 seconds)

```bash
cd email-scheduler
docker-compose up -d
```

This starts PostgreSQL and Redis in the background.

## Step 4: Configure Backend (1 minute)

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your credentials:

```bash
# Email (from Ethereal)
SMTP_USER=your-user@ethereal.email
SMTP_PASS=your-password

# Google OAuth (from Google Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

All other defaults are fine for local development.

## Step 5: Start Backend (30 seconds)

**Terminal 1 - API Server:**
```bash
npm run dev
```

**Terminal 2 - Worker:**
```bash
npm run worker:dev
```

Backend runs on http://localhost:3000

## Step 6: Start Frontend (30 seconds)

**Terminal 3:**
```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3001

## Step 7: Test the Application

1. Open http://localhost:3001
2. Click **"Sign in with Google"**
3. Complete Google OAuth flow
4. You'll be redirected to the dashboard
5. Click **"+ Compose New Email"**
6. Fill in:
   - Sender Email: `test@example.com`
   - Subject: `Test Email`
   - Body: `<h1>Hello!</h1>`
   - Upload `sample-emails.csv` (in email-scheduler folder)
   - Start Time: (pick a time 2-3 minutes in the future)
   - Delay: `2000` (2 seconds)
7. Click **"Schedule Emails"**
8. Switch to **"Scheduled Emails"** tab to see your scheduled emails
9. Wait for the scheduled time and check worker terminal for sending logs
10. After emails are sent, switch to **"Sent Emails"** tab

## View Sent Emails

1. Check the worker terminal for **Preview URL** logs
2. Click the Ethereal preview URLs to see sent emails
3. Or visit https://ethereal.email and login with your SMTP credentials

## Test Server Restart Persistence

1. Stop the API server and worker (Ctrl+C in both terminals)
2. Restart both:
   ```bash
   npm run dev
   npm run worker:dev
   ```
3. Future scheduled emails will still send at their scheduled times
4. No emails are duplicated

## Test Rate Limiting

1. Edit `backend/.env` and set `MAX_EMAILS_PER_HOUR=5`
2. Restart the worker
3. Schedule 10 emails with start time = now
4. Watch the worker logs:
   - First 5 emails send immediately
   - Remaining 5 are rescheduled to next hour

## Troubleshooting

**Can't connect to database?**
```bash
docker-compose ps  # Check if containers are running
docker-compose logs postgres  # Check PostgreSQL logs
```

**Worker not processing jobs?**
```bash
docker-compose logs redis  # Check Redis logs
# Verify Redis is accessible
redis-cli ping  # Should return PONG
```

**Frontend can't reach backend?**
- Check backend is running on port 3000
- Check CORS configuration in `backend/src/index.ts`

**Google OAuth fails?**
- Verify redirect URI matches exactly: `http://localhost:3000/auth/google/callback`
- Check Google Console for OAuth consent screen configuration

## Next Steps

- 📖 Read [README.md](./README.md) for complete documentation
- 🔒 Review [SECURITY.md](./SECURITY.md) for security analysis
- ✅ Check [REQUIREMENTS.md](./REQUIREMENTS.md) for feature mapping
- 🧪 Import `Email-Scheduler-API.postman_collection.json` to test API directly

## Stopping the Application

```bash
# Stop backend and frontend (Ctrl+C in each terminal)

# Stop Docker containers
docker-compose down

# Or keep data and just stop
docker-compose stop
```

## Need Help?

See detailed documentation in [README.md](./README.md) or check the inline code comments.

---

**Estimated Total Setup Time:** 7-10 minutes (including credential setup)  
**Estimated Testing Time:** 5 minutes
