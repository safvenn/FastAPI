# 🚀 Quick Start Guide

## Backend Setup (5 minutes)

### 1. Install Python Packages
```cmd
.venv\Scripts\activate
pip install --prefer-binary -r requirements.txt
```

### 2. Configure Environment
Make sure `.env` file exists with:
```env
GEMINI_API_KEY=your_api_key_here
```

### 3. Start Backend Server
```cmd
uvicorn main:app --reload
```

Backend will run on: **http://localhost:8000**

---

## Frontend Setup (3 minutes)

### 1. Navigate to Frontend
```cmd
cd frontend
```

### 2. Install Dependencies
```cmd
npm install
```

### 3. Start Frontend
```cmd
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## ✅ You're Done!

Open your browser:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 🎯 Features to Try

1. **Sign Up** - Create a new account
2. **Add Expenses** - Track your spending
3. **View Charts** - See beautiful analytics
4. **AI Chat** - Get financial advice
5. **Switch AI Models** - Toggle between Gemini and Ollama

---

## 🔧 Troubleshooting

### Backend won't start?
- Check PostgreSQL is running
- Verify `.env` file exists
- Make sure virtual environment is activated

### Frontend won't start?
- Delete `node_modules` and run `npm install` again
- Check Node.js is installed: `node --version`

### Can't connect to database?
- Check PostgreSQL credentials in `db.py`
- Ensure database `expense_tracker` exists

---

## 📚 Documentation

- **Backend Setup:** `PYTHON_SETUP_GUIDE.md`
- **Frontend Setup:** `frontend/SETUP.md`
- **AI Model Switcher:** `frontend/AI_MODEL_SWITCHER.md`
- **Date Feature:** `frontend/UPDATES.md`

---

**Happy Coding!** 🎉
