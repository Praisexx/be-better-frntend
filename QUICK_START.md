# Quick Start Guide

## ✅ What's Already Set Up

✓ Backend Python dependencies installed
✓ Frontend Node dependencies installed
✓ Redis is running
✓ PostgreSQL is running
✓ Environment files created

## 🔧 What You Need to Do

### Step 1: Set Up PostgreSQL Database

Your PostgreSQL requires authentication. Choose one of these options:

**Option A: Use SQLite (Easiest for development)**
```bash
cd backend
# Edit .env and change DATABASE_URL to:
DATABASE_URL=sqlite:///./metaads.db
```

**Option B: Set PostgreSQL Password**
```bash
# Set password for your PostgreSQL user
psql postgres
# In psql prompt:
ALTER USER covenantchukwudi WITH PASSWORD 'yourpassword';
CREATE DATABASE metaads_analyzer;
\q

# Then update backend/.env:
DATABASE_URL=postgresql://covenantchukwudi:yourpassword@localhost:5432/metaads_analyzer
```

### Step 2: Add Your API Keys

Edit `backend/.env` and add:

1. **OpenAI API Key** (Required for AI analysis)
   - Get from: https://platform.openai.com/api-keys
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

2. **Resend API Key** (Required for emails)
   - Get from: https://resend.com/api-keys
   ```
   RESEND_API_KEY=re_your-key-here
   FROM_EMAIL=your-email@yourdomain.com
   ```

### Step 3: Create Database Tables

```bash
cd backend
source venv/bin/activate
python -c "from app.database import Base, engine; from app.models import User, Analysis; Base.metadata.create_all(bind=engine); print('✓ Database tables created!')"
```

### Step 4: Start the Application

**Terminal 1 - Backend API:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

**Terminal 2 - Celery Worker:**
```bash
cd backend
source venv/bin/activate
celery -A app.services.celery_app worker --loglevel=info
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

### Step 5: Use the App!

1. Open http://localhost:3000
2. Register a new account
3. Upload a Meta Ads CSV
4. Get AI-powered insights!

## 🚀 Quick Commands

```bash
# Start everything (use 3 terminals)
# Terminal 1
cd backend && source venv/bin/activate && uvicorn main:app --reload

# Terminal 2
cd backend && source venv/bin/activate && celery -A app.services.celery_app worker --loglevel=info

# Terminal 3
cd frontend && npm start
```

## 📝 Notes

- **SQLite vs PostgreSQL**: For quick testing, use SQLite. For production, use PostgreSQL.
- **API Keys**: You need both OpenAI and Resend keys for full functionality
- **Celery**: Must be running to process uploaded CSV files
- **Redis**: Already running on your system

## ❓ Troubleshooting

**Database connection error?**
- Use SQLite instead (see Option A above)
- Or set PostgreSQL password (see Option B above)

**Can't start Celery?**
- Make sure Redis is running: `redis-cli ping` (should return PONG)

**Frontend won't start?**
- Make sure port 3000 is available
- Run `npm install` again if needed

Need help? Check the full README.md for detailed documentation.
