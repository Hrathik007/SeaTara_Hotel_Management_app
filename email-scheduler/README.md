# 📧 Email Scheduler - Production-Grade Email Job Scheduler

A full-stack email scheduler application built with TypeScript, Express, BullMQ, Redis, PostgreSQL, and React. This system allows scheduling emails at scale with rate limiting, concurrency control, and persistent job management.

## 🎯 Features Implemented

### Backend Features ✅
- **TypeScript/Express API** with comprehensive email scheduling endpoints
- **BullMQ + Redis** for persistent job scheduling (no cron jobs)
- **PostgreSQL Database** with TypeORM for data persistence
- **Ethereal Email** SMTP integration for testing
- **Google OAuth 2.0** authentication
- **Rate Limiting** - Configurable emails per hour with Redis-backed counters
- **Worker Concurrency** - Configurable parallel job processing
- **Delay Between Emails** - Minimum delay to mimic provider throttling
- **Persistent State** - Survives server restarts without losing jobs
- **Idempotency** - Same email never sent twice
- **Multi-Sender Support** - Rate limiting per sender

### Frontend Features ✅
- **React + TypeScript** with Vite
- **Tailwind CSS** for styling
- **Google OAuth Login** with user info display
- **Compose Email Form** with CSV upload
- **Scheduled Emails Table** with loading and empty states
- **Sent Emails Table** with status tracking
- **Clean Component Architecture** - Reusable UI components

## 🏗️ Architecture Overview

### How Scheduling Works
1. User schedules emails via API or frontend
2. Email records are created in PostgreSQL database
3. BullMQ delayed jobs are created with calculated delays
4. Jobs are persisted in Redis for durability
5. Worker processes jobs based on concurrency settings
6. Rate limiter checks per-sender hourly limits before sending
7. If rate limited, job is rescheduled to next available hour
8. Email is sent via Ethereal SMTP
9. Status is updated in database

### How Persistence Works
- All email jobs are stored in PostgreSQL with their scheduled times
- BullMQ persists jobs in Redis with delayed execution
- Job IDs match email record IDs for idempotency
- On server restart:
  - Database retains all email records
  - Redis retains all BullMQ jobs
  - Worker reconnects and continues processing
  - Future emails are sent at correct times

### How Rate Limiting Works
- Redis-backed counters keyed by `rate_limit:{sender}:{hour_window}`
- Before sending, worker checks current hour's count
- If limit exceeded, job is rescheduled to next hour
- Counters automatically expire after 1 hour
- Configurable via `MAX_EMAILS_PER_HOUR` environment variable
- Safe across multiple worker instances

### How Concurrency Works
- BullMQ worker configured with `WORKER_CONCURRENCY` setting
- Multiple jobs process in parallel
- Rate limiting is thread-safe via Redis atomic operations
- Minimum delay between emails enforced via `MIN_DELAY_BETWEEN_EMAILS`

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (recommended for Redis and PostgreSQL)
- Google OAuth credentials (for authentication)

### 1. Start Infrastructure

```bash
cd email-scheduler
docker-compose up -d
```

This starts PostgreSQL on port 5432 and Redis on port 6379.

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` and configure:
- Database credentials (PostgreSQL)
- Redis connection
- Ethereal Email SMTP credentials (get from https://ethereal.email)
- Google OAuth credentials
- Rate limiting and concurrency settings

**Get Ethereal Email Credentials:**
1. Visit https://ethereal.email
2. Click "Create Ethereal Account"
3. Copy the SMTP credentials to your `.env` file

**Setup Google OAuth:**
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Secret to `.env`

```bash
# Build the backend
npm run build

# Start the API server
npm run dev

# In a separate terminal, start the worker
npm run worker:dev
```

Backend will run on http://localhost:3000

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on http://localhost:3001

## 📡 API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth login
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/logout` - Logout user
- `GET /auth/user` - Get current user

### Email Scheduling
- `POST /api/emails/schedule` - Schedule a single email
- `POST /api/emails/schedule-bulk` - Schedule multiple emails from CSV
- `GET /api/emails/scheduled` - Get scheduled emails
- `GET /api/emails/sent` - Get sent emails
- `GET /api/emails/:id` - Get email by ID

### Health Check
- `GET /health` - Server health status

## 🔧 Configuration

### Environment Variables

```bash
# Server
PORT=3000
NODE_ENV=development

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=email_scheduler

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email (Ethereal)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-user@ethereal.email
SMTP_PASS=your-password

# BullMQ Worker Configuration
WORKER_CONCURRENCY=5              # Number of concurrent jobs
MIN_DELAY_BETWEEN_EMAILS=2000     # Milliseconds between sends
MAX_EMAILS_PER_HOUR=200           # Per-sender hourly limit

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
SESSION_SECRET=your-session-secret

# Frontend
FRONTEND_URL=http://localhost:3001
```

### Rate Limiting Configuration

The `MAX_EMAILS_PER_HOUR` setting controls how many emails can be sent per sender per hour:

- **Global limit**: Set once, applies to all senders
- **Per-sender tracking**: Each sender has independent counter
- **Redis-backed**: Safe across multiple worker instances
- **Automatic rescheduling**: When limit reached, jobs move to next hour
- **No job loss**: Rate-limited jobs are rescheduled, not dropped

Example: With `MAX_EMAILS_PER_HOUR=200`:
- Sender A can send 200 emails/hour
- Sender B can send 200 emails/hour
- If sender A hits limit, their jobs reschedule to next hour
- Sender B is unaffected

### Concurrency & Delay

- `WORKER_CONCURRENCY`: How many jobs run simultaneously
- `MIN_DELAY_BETWEEN_EMAILS`: Minimum milliseconds between individual sends

Example with 1000 emails scheduled:
- Concurrency=5: 5 emails process in parallel
- Delay=2000ms: 2-second pause between each send
- Rate limit=200/hour: After 200, remaining move to next hour

## 📂 Project Structure

```
email-scheduler/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Redis, Passport config
│   │   ├── entities/        # TypeORM entities
│   │   ├── services/        # Business logic
│   │   │   ├── queue.ts     # BullMQ queue setup
│   │   │   ├── emailService.ts
│   │   │   ├── rateLimiter.ts
│   │   │   └── schedulerService.ts
│   │   ├── controllers/     # API controllers
│   │   ├── routes/          # Express routes
│   │   ├── middleware/      # Auth middleware
│   │   ├── index.ts         # Express app
│   │   └── worker.ts        # BullMQ worker
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── docker-compose.yml       # Redis & PostgreSQL
```

## 🧪 Testing the System

### 1. Schedule Emails via Frontend
1. Login with Google
2. Click "Compose New Email"
3. Fill in details and upload CSV with emails
4. Set start time and delay
5. Click "Schedule Emails"
6. View in "Scheduled Emails" tab

### 2. Schedule via API (Postman/cURL)

```bash
# Login first to get session cookie
curl http://localhost:3000/auth/google

# Schedule bulk emails
curl -X POST http://localhost:3000/api/emails/schedule-bulk \
  -H "Content-Type: application/json" \
  -d '{
    "csvContent": "user1@example.com\nuser2@example.com",
    "subject": "Test Email",
    "body": "<h1>Hello!</h1>",
    "senderEmail": "sender@example.com",
    "startTime": "2024-01-20T10:00:00Z",
    "delayBetweenEmails": 2000
  }'
```

### 3. Test Server Restart Persistence

```bash
# Schedule some emails
# Stop the server and worker (Ctrl+C)
# Restart both
npm run dev
npm run worker:dev

# Future emails will still be sent at correct times
# No emails are duplicated or lost
```

### 4. Test Rate Limiting

```bash
# Set MAX_EMAILS_PER_HOUR=10 in .env
# Schedule 50 emails
# Watch logs: First 10 send immediately
# Remaining 40 reschedule to next hour
```

## 🎥 Demo Video

The demo video should show:
1. ✅ Scheduling emails from frontend
2. ✅ Viewing scheduled emails table
3. ✅ Viewing sent emails table
4. ✅ Server restart - stop server, restart, future emails still send
5. ✅ Rate limiting behavior (optional but recommended)

## 🔒 Security Features

- Google OAuth 2.0 authentication
- Session-based auth with secure cookies
- CORS protection
- Input validation with express-validator
- SQL injection protection via TypeORM
- Application-level rate limiting to prevent email abuse

**Security Notes for Production:**
- Add CSRF protection (e.g., csurf middleware) for forms
- Add API rate limiting (e.g., express-rate-limit) to prevent DDoS
- Use Redis session store instead of memory store
- Enable HTTPS/TLS for all connections
- Implement request signing or API keys for external integrations
- Add comprehensive audit logging
- Use environment-based secrets management (AWS Secrets Manager, HashiCorp Vault)

## 🚀 Production Deployment

For production:

1. Set `NODE_ENV=production`
2. Use managed PostgreSQL (AWS RDS, etc.)
3. Use managed Redis (AWS ElastiCache, etc.)
4. Set `synchronize: false` in database config
5. Run migrations separately
6. Use PM2 or similar for process management
7. Set up monitoring and logging
8. Use real SMTP provider (SendGrid, AWS SES, etc.)
9. Enable SSL/TLS for all connections
10. Set secure session cookies

## 📋 Requirements Checklist

### Backend ✅
- [x] TypeScript + Express
- [x] BullMQ + Redis for scheduling
- [x] PostgreSQL with TypeORM
- [x] Ethereal Email SMTP
- [x] No cron jobs
- [x] Persistent state across restarts
- [x] Worker concurrency configuration
- [x] Delay between emails
- [x] Rate limiting (per-sender, per-hour)
- [x] Idempotency (no duplicate sends)
- [x] Multi-sender support

### Frontend ✅
- [x] React + TypeScript
- [x] Tailwind CSS
- [x] Google OAuth login
- [x] Dashboard with tabs
- [x] Compose email form
- [x] CSV upload and parsing
- [x] Scheduled emails table
- [x] Sent emails table
- [x] Loading states
- [x] Empty states
- [x] Error handling
- [x] User info display
- [x] Logout functionality

### Infrastructure ✅
- [x] Docker Compose for Redis and PostgreSQL
- [x] Environment configuration
- [x] Clean code structure
- [x] Comprehensive documentation

## 🐛 Known Limitations & Trade-offs

1. **Ethereal Email**: Free tier has limits; use real SMTP in production
2. **Google OAuth**: Requires public callback URL in production
3. **Session Storage**: In-memory sessions don't scale; use Redis in production
4. **Database Sync**: Auto-sync is on in development; migrations required for production
5. **Error Handling**: Basic error messages; enhance for production
6. **Rate Limit Race Condition**: Small window exists between check and send in concurrent workers. Mitigated by incrementing counter before sending, but not fully atomic. For strict guarantees, consider implementing a Redis-based distributed lock.
7. **Bulk Scheduling Performance**: For very large batches (1000+), rate limit checks on every email create many Redis calls. Acceptable for typical use cases (10-100 emails), but could be optimized by batching checks for massive campaigns.
8. **Email Validation**: Uses simple regex; consider validator.js library for production


## 📚 Learn More

- [BullMQ Documentation](https://docs.bullmq.io/)
- [TypeORM Documentation](https://typeorm.io/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 👨‍💻 Author

Built as part of ReachInbox hiring assignment.

## 📄 License

MIT
