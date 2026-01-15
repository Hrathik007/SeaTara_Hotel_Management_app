# SeaTara Hotel Management App & Email Scheduler

This repository contains two distinct applications:

## 1. 🏨 SeaTara Hotel Management System (Original)

A Spring Boot-based hotel booking and management system located in `backend/` and `frontend/` directories.

**Tech Stack:**
- Backend: Spring Boot (Java)
- Frontend: React
- Database: MySQL/PostgreSQL

See [backend/README.md](./backend/README.md) and [frontend/README.md](./frontend/README.md) for details.

---

## 2. 📧 Email Job Scheduler (ReachInbox Assignment)

A production-grade email scheduler service built as part of the ReachInbox hiring assignment. Located in the `email-scheduler/` directory.

**Tech Stack:**
- Backend: TypeScript + Express.js + BullMQ + Redis + PostgreSQL
- Frontend: React + TypeScript + Tailwind CSS
- Queue: BullMQ with Redis
- Email: Ethereal Email (SMTP testing)

### Quick Start for Email Scheduler

```bash
# Navigate to email scheduler
cd email-scheduler

# Start infrastructure (Redis & PostgreSQL)
docker-compose up -d

# Setup and start backend
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
# In another terminal
npm run worker:dev

# Setup and start frontend
cd ../frontend
npm install
npm run dev
```

**Full Documentation:** See [email-scheduler/README.md](./email-scheduler/README.md)

### Key Features

✅ **Backend:**
- TypeScript/Express API with comprehensive scheduling endpoints
- BullMQ + Redis for persistent job scheduling (no cron)
- PostgreSQL with TypeORM for data persistence
- Rate limiting (configurable emails per hour per sender)
- Worker concurrency and delay controls
- Survives server restarts without losing jobs
- Idempotency (no duplicate sends)

✅ **Frontend:**
- React + TypeScript with Vite
- Google OAuth 2.0 authentication
- Compose email form with CSV upload
- Scheduled and sent emails dashboards
- Tailwind CSS styling
- Real-time status updates

### Assignment Requirements Met

This implementation fulfills all requirements from the ReachInbox Full-stack Email Job Scheduler assignment:

- [x] TypeScript + Express backend
- [x] BullMQ + Redis scheduling
- [x] PostgreSQL database
- [x] Ethereal Email SMTP
- [x] No cron jobs
- [x] Persistent state across restarts
- [x] Worker concurrency
- [x] Delay between emails
- [x] Rate limiting (emails per hour)
- [x] React + TypeScript frontend
- [x] Tailwind CSS
- [x] Google OAuth login
- [x] Dashboard with scheduled/sent views
- [x] CSV upload and parsing

---

## Repository Structure

```
.
├── backend/              # Spring Boot hotel management backend
├── frontend/             # React hotel management frontend
├── email-scheduler/      # ReachInbox email scheduler assignment
│   ├── backend/         # TypeScript/Express API + BullMQ worker
│   ├── frontend/        # React/TypeScript dashboard
│   ├── docker-compose.yml
│   └── README.md        # Complete documentation
├── LICENSE
└── README.md            # This file
```

## License

MIT License - See [LICENSE](./LICENSE) file for details.
