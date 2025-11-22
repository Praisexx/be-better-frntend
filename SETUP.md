# Quick Setup Guide

## ✅ What's Already Done
- Backend Python dependencies installed
- Frontend Node dependencies installed
- Environment files created

## 🔧 What You Need to Do

### 1. Install PostgreSQL
```bash
# On macOS
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb metaads_analyzer
```

### 2. Install Redis
```bash
# On macOS
brew install redis
brew services start redis
```

### 3. Get API Keys

#### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to `backend/.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

#### Resend API Key (for emails)
1. Go to https://resend.com/api-keys
2. Create account and get API key
3. Add it to `backend/.env`:
   ```
   RESEND_API_KEY=re_your-key-here
   FROM_EMAIL=your-email@yourdomain.com
   ```

### 4. Update Database URL
Edit `backend/.env` and update the DATABASE_URL:
```
DATABASE_URL=postgresql://your-username@localhost:5432/metaads_analyzer
```

### 5. Run Database Migrations
```bash
cd backend
source venv/bin/activate
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### 6. Start the Application

#### Terminal 1 - Start Backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

#### Terminal 2 - Start Celery Worker
```bash
cd backend
source venv/bin/activate
celery -A app.services.celery_app worker --loglevel=info
```

#### Terminal 3 - Start Frontend
```bash
cd frontend
npm start
```

### 7. Test It Out
1. Open http://localhost:3000
2. Register a new account
3. Upload a Meta Ads CSV file
4. Watch the magic happen!

## 🚀 Ready to Deploy?

See the main README.md for deployment instructions to Render and Vercel.

## 📝 Notes

- Make sure PostgreSQL and Redis are running before starting the backend
- The Celery worker must be running to process uploaded files
- You need valid API keys for OpenAI and Resend for full functionality
