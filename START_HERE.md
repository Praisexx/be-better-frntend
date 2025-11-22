# 🎉 Meta Ads AI Analyzer - START HERE

## What I've Built For You

A complete full-stack application that:
- Accepts Meta Ads CSV uploads
- Analyzes them with AI (OpenAI GPT-4)
- Generates comprehensive reports
- Sends results via email
- Provides PDF downloads
- Has a beautiful dashboard

## ✅ What's Already Done

- ✓ Backend (FastAPI + Python) - fully coded
- ✓ Frontend (React) - fully coded
- ✓ All dependencies installed
- ✓ Redis running
- ✓ PostgreSQL running
- ✓ Project structure complete

## 🚀 Next Steps (5 Minutes)

### 1. Add Your API Keys

Open `backend/.env` and add:

```env
OPENAI_API_KEY=sk-your-key-here     # Get from https://platform.openai.com/api-keys
RESEND_API_KEY=re-your-key-here      # Get from https://resend.com/api-keys
```

### 2. Set Up Database

**Option A: Quick (SQLite)**
```bash
# Edit backend/.env and change DATABASE_URL to:
DATABASE_URL=sqlite:///./metaads.db
```

**Option B: Production (PostgreSQL)**
```bash
# Set PostgreSQL password and create database
# Then update backend/.env with your password
```

### 3. Create Database Tables

```bash
cd backend
source venv/bin/activate
python -c "from app.database import Base, engine; from app.models import User, Analysis; Base.metadata.create_all(bind=engine)"
```

### 4. Run the App (3 Terminals)

**Terminal 1:**
```bash
./run_backend.sh
```

**Terminal 2:**
```bash
./run_worker.sh
```

**Terminal 3:**
```bash
./run_frontend.sh
```

### 5. Open and Test!

Go to: **http://localhost:3000**

## 📖 Full Documentation

- **QUICK_START.md** - Detailed setup instructions
- **README.md** - Complete documentation
- **SETUP.md** - Technical setup guide

## 🎯 How It Works

1. User registers/logs in
2. Uploads Meta Ads CSV (up to 200MB)
3. File queued for processing
4. AI analyzes the data
5. Results displayed on dashboard
6. Email sent with analysis
7. PDF available for download

## 🛠️ Tech Stack

**Backend:** FastAPI, PostgreSQL, Celery, Redis, OpenAI API
**Frontend:** React, Axios, React Router
**Deployment:** Render (backend) + Vercel (frontend)

## 💡 Quick Tips

- Use SQLite for testing (fastest setup)
- You MUST have API keys for full functionality
- Celery worker is required for file processing
- Check console for any errors

## ❓ Need Help?

Read the detailed guides:
1. QUICK_START.md - Step by step
2. README.md - Full documentation
3. Check backend/frontend logs for errors

---

**You're almost there! Just add your API keys and you're ready to go!** 🚀
