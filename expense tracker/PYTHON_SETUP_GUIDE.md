# Python Environment Setup Guide

## ✅ Setup Complete!

Your new virtual environment has been created at `.venv`

## 📦 Installation Steps

### Option 1: Automatic Setup (Recommended)
Run the batch file:
```cmd
setup_venv.bat
```

### Option 2: Manual Setup

1. **Activate the virtual environment:**
```cmd
.venv\Scripts\activate
```

2. **Upgrade pip:**
```cmd
python -m pip install --upgrade pip
```

3. **Install packages:**
```cmd
pip install --prefer-binary -r requirements.txt
```

If you encounter build errors, install packages one by one:
```cmd
pip install fastapi uvicorn[standard] sqlalchemy alembic
pip install python-jose[cryptography] passlib[bcrypt] bcrypt
pip install python-dotenv pydantic-settings
pip install google-generativeai httpx
pip install psycopg2-binary
```

## 🔧 Setting Python Interpreter in VS Code

1. Press `Ctrl + Shift + P`
2. Type: `Python: Select Interpreter`
3. Choose: `.\.venv\Scripts\python.exe`

Or manually add to `.vscode/settings.json`:
```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}\\.venv\\Scripts\\python.exe"
}
```

## 🚀 Running the Application

1. **Activate virtual environment:**
```cmd
.venv\Scripts\activate
```

2. **Run the server:**
```cmd
uvicorn main:app --reload
```

3. **Access the API:**
- API: http://localhost:8000
- Docs: http://localhost:8000/docs

## 📋 Verify Installation

Check installed packages:
```cmd
pip list
```

Check Python version:
```cmd
python --version
```

## ⚠️ Troubleshooting

### Build Tools Error
If you see "Microsoft Visual C++ 14.0 or greater is required":

**Solution:** Use pre-built wheels (already configured in requirements.txt)
```cmd
pip install --prefer-binary -r requirements.txt
```

### psycopg2 Error
If psycopg2-binary fails:
```cmd
pip install psycopg2-binary --only-binary :all:
```

### Slow Installation
If pip is slow, use a faster mirror:
```cmd
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### Import Errors
Make sure you're using the virtual environment:
```cmd
where python
# Should show: ...\expense tracker\.venv\Scripts\python.exe
```

## 📝 Environment Variables

Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🗄️ Database Setup

Make sure PostgreSQL is running and create the database:
```sql
CREATE DATABASE expense_tracker;
```

Update `db.py` with your PostgreSQL credentials if needed.

## 🔄 Database Migrations

Run migrations:
```cmd
alembic upgrade head
```

Create new migration:
```cmd
alembic revision --autogenerate -m "description"
```

## ✨ All Set!

Your Python environment is ready. Happy coding! 🎉
