# 💰 Expense Tracker - Full Stack Application

A modern, feature-rich expense tracking application with AI-powered financial insights.

## 🌟 Features

### Backend (FastAPI + PostgreSQL)
- ✅ User authentication with JWT tokens
- ✅ CRUD operations for expenses
- ✅ Category-based expense tracking
- ✅ AI financial assistant (Gemini & Ollama)
- ✅ RESTful API with automatic documentation
- ✅ Database migrations with Alembic
- ✅ CORS enabled for frontend integration

### Frontend (React + TypeScript + Tailwind CSS)
- ✅ Beautiful, responsive UI
- ✅ User authentication (login/signup)
- ✅ Add, view, and delete expenses
- ✅ Search and filter expenses
- ✅ Interactive charts (bar, pie, line)
- ✅ Statistics dashboard
- ✅ AI chat assistant with model switcher
- ✅ Date and time tracking
- ✅ Real-time updates

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI
- **Database:** PostgreSQL + SQLAlchemy
- **Authentication:** JWT (python-jose)
- **Password Hashing:** bcrypt
- **AI:** Google Gemini API, Ollama
- **Migrations:** Alembic

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Icons:** Lucide React
- **Date Handling:** date-fns

## 📁 Project Structure

```
expense-tracker/
├── api/                      # AI service modules
│   ├── aiservice.py         # Gemini AI integration
│   └── ollamaai.py          # Ollama local AI
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # Auth context
│   │   ├── pages/           # Page components
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── migrations/               # Database migrations
├── auth.py                   # Authentication logic
├── config.py                 # Configuration
├── db.py                     # Database connection
├── main.py                   # FastAPI application
├── models.py                 # Database models
├── schemas.py                # Pydantic schemas
├── requirements.txt          # Python dependencies
├── .env                      # Environment variables
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL
- (Optional) Ollama for local AI

### 1. Backend Setup

```bash
# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# or
source .venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Run migrations
alembic upgrade head

# Start server
uvicorn main:app --reload
```

Backend runs on: **http://localhost:8000**

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: **http://localhost:3000**

## 📖 API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Main Endpoints

#### Authentication
- `POST /signup` - Register new user
- `POST /login` - Login and get JWT token

#### Expenses
- `GET /userexpenses` - Get all user expenses
- `POST /expense` - Add new expense
- `DELETE /delete?i={id}` - Delete expense

#### AI Assistant
- `POST /chat?chat={message}` - Chat with Gemini AI
- `POST /olama?chat={message}` - Chat with Ollama AI

## 🎨 Frontend Features

### Dashboard
- Total expenses overview
- Statistics cards (total, monthly, average, top category)
- Interactive charts (bar, pie, line)
- Expense list with search and filters

### AI Chat
- Floating chat button
- Model switcher (Gemini/Ollama)
- Context-aware financial advice
- Beautiful chat interface

### Expense Management
- Add expenses with title, amount, category, description
- View expenses with date and time
- Delete expenses with confirmation
- Search by title
- Filter by category

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional (if using different database)
DATABASE_URL=postgresql://user:password@localhost:5432/expense_tracker
```

## 🗄️ Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE expense_tracker;
```

2. Update connection string in `db.py` if needed:
```python
dbconnection = "postgresql://postgres:password@localhost:5432/expense_tracker"
```

3. Run migrations:
```bash
alembic upgrade head
```

## 🤖 AI Setup

### Gemini (Cloud)
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env` file
3. Model automatically uses `gemini-1.5-flash`

### Ollama (Local)
1. Install [Ollama](https://ollama.ai)
2. Pull a model:
```bash
ollama pull llama2
# or
ollama pull gemma:2b
```
3. Update model name in `api/ollamaai.py` if needed

## 📊 Database Schema

### Users Table
- id (Primary Key)
- username (Unique)
- email (Unique)
- password (Hashed)
- total_exp (Total expenses)

### Expenses Table
- id (Primary Key)
- title
- amount
- category
- description
- user_email (Foreign Key)
- created_at
- updated_at

## 🧪 Testing

### Backend
```bash
# Run tests (if you add them)
pytest
```

### Frontend
```bash
cd frontend
npm run test
```

## 📦 Building for Production

### Backend
```bash
# Use production ASGI server
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

## 🐛 Troubleshooting

### Backend Issues
- **Import errors:** Make sure virtual environment is activated
- **Database errors:** Check PostgreSQL is running and credentials are correct
- **AI errors:** Verify API keys and model names

### Frontend Issues
- **Build errors:** Delete `node_modules` and run `npm install` again
- **API connection:** Ensure backend is running on port 8000
- **CORS errors:** Check CORS middleware in `main.py`

## 📚 Documentation

- **Backend Setup:** `PYTHON_SETUP_GUIDE.md`
- **Frontend Setup:** `frontend/SETUP.md`
- **Quick Start:** `QUICK_START.md`
- **AI Model Switcher:** `frontend/AI_MODEL_SWITCHER.md`
- **Updates:** `frontend/UPDATES.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

Built with ❤️ using FastAPI, React, and AI

## 🙏 Acknowledgments

- FastAPI for the amazing web framework
- React team for the UI library
- Google for Gemini AI
- Ollama for local AI capabilities
- Tailwind CSS for beautiful styling

---

**Happy expense tracking!** 💰✨
