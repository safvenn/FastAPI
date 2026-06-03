<p align="center">
  <h1 align="center">👟 KICKS — Premium Sneaker E-Commerce Platform</h1>
  <p align="center">
    <strong>Full-Stack E-Commerce with AI-Powered Recommendations</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/TailwindCSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white" alt="SQLAlchemy" />
  </p>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [AI Agent](#-ai-agent)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Frontend Pages](#-frontend-pages)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)

---

## 🚀 Overview

**KICKS** is a production-ready, full-stack sneaker e-commerce platform built with **FastAPI** (Python) and **React 19**. It features a complete shopping experience from browsing to checkout, with a unique **AI-powered shoe recommendation engine** powered by Google's Gemini AI.

The platform includes a robust authentication system with **email verification + OTP-based 2FA**, **Google OAuth**, role-based access control, a full admin panel, and a glassmorphism-inspired dark UI that looks premium.

---

## ✨ Key Features

### 🛍️ Shopping Experience
- **Product Catalog** — Browse, search, and filter sneakers by brand
- **Product Detail Pages** — Full product info with size selection
- **Shopping Cart** — Add/remove items with size selection, quantity management
- **Checkout & Orders** — Complete order flow with order history tracking
- **Auto-Sliding Carousel** — Featured products with animated transitions
- **Brand Marquee** — Infinite scrolling brand banner
- **Live Price Formatting** — Market-style price display

### 🤖 AI-Powered Recommendations
- **Gemini AI Integration** — Google's Gemini 2.5 Flash Lite model
- **3-Step Guided Flow** — Budget → Brand → Chat for personalized results
- **Smart Product Matching** — AI mentions are auto-linked to clickable product cards
- **Markdown Rendering** — AI responses render with styled headings, bold, bullets, and code
- **Typewriter Animation** — Character-by-character reveal for AI responses

### 🔐 Authentication & Security
- **JWT Access + Refresh Tokens** — Auto-refresh on 401 with request queuing
- **Email Verification** — New signups must verify via email link
- **OTP-Based 2FA** — 6-digit OTP sent via email on every login
- **Google OAuth Login** — One-click Google sign-in
- **Forgot/Reset Password** — Email-based password recovery flow
- **Role-Based Access** — Admin and user roles with protected routes

### 👤 User Features
- **User Profile** — View and manage account info
- **Address Management** — Save and manage delivery addresses
- **Order History** — Track all past orders

### 🛠️ Admin Panel
- **Product Management** — CRUD operations on products (add, edit, delete)
- **User Management** — View all users, manage roles
- **Protected Admin Routes** — Only accessible by admin role

---

## 🏗️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** | High-performance Python web framework |
| **SQLAlchemy** | ORM for database operations |
| **PostgreSQL** | Production-grade relational database |
| **Alembic** | Database migration management |
| **python-jose** | JWT token creation and verification |
| **passlib + bcrypt** | Password hashing |
| **Google GenAI** | Gemini AI integration for recommendations |
| **FastMail** | Email sending for verification, OTP, password reset |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework with hooks and functional components |
| **Vite 8** | Lightning-fast dev server and build tool |
| **React Router v7** | Client-side routing with protected routes |
| **Framer Motion** | Smooth animations and page transitions |
| **Tailwind CSS v4** | Utility-first CSS with custom design system |
| **Axios** | HTTP client with interceptors for auth |
| **React Hot Toast** | Elegant notification toasts |
| **React Icons (Feather)** | Consistent icon system |

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React 19 + Vite)              │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Pages   │ │Components│ │ Context  │ │   Services   │  │
│  │  Home    │ │ Navbar   │ │ Auth     │ │   api.js     │  │
│  │  Products│ │ Hero     │ │ Cart     │ │ (Axios +     │  │
│  │  Cart    │ │ AiAgent  │ │          │ │  JWT refresh)│  │
│  │  Admin   │ │ Cards    │ │          │ │              │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────┬───────┘  │
│                                                 │          │
└─────────────────────────────────────────────────┼──────────┘
                                                  │ HTTP/JSON
┌─────────────────────────────────────────────────┼──────────┐
│                   BACKEND (FastAPI)              │          │
│                                                  ▼          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │   Auth   │ │ Products │ │   Cart   │ │    Orders    │  │
│  │ JWT/OTP  │ │  CRUD    │ │ Add/Del  │ │  Checkout    │  │
│  │ Google   │ │  Search  │ │  Sizes   │ │  History     │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │  Users   │ │  Admin   │ │    AI    │ ← Gemini API     │
│  │ Profile  │ │  Panel   │ │ Recommend│                   │
│  │ Address  │ │ Manage   │ │  Engine  │                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
│                       │                                     │
│                       ▼                                     │
│              ┌──────────────┐                               │
│              │  PostgreSQL  │                               │
│              │   Database   │                               │
│              └──────────────┘                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI Agent

The AI Agent is a standout feature — a floating chatbot panel that acts as a personal shoe expert.

### How It Works

```
User opens AI panel
        │
        ▼
  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
  │  1. Budget   │ ──► │  2. Brand   │ ──► │   3. Chat   │
  │  $50 - $500  │     │  Nike, etc. │     │  Free text  │
  └─────────────┘     └─────────────┘     └──────┬──────┘
                                                  │
                                    POST /ai { budget, brand, text }
                                                  │
                                                  ▼
                                        ┌─────────────────┐
                                        │  Backend filters │
                                        │  products by     │
                                        │  budget + brand  │
                                        │       │          │
                                        │       ▼          │
                                        │  Gemini AI gets  │
                                        │  filtered list + │
                                        │  user query      │
                                        │       │          │
                                        │       ▼          │
                                        │  Returns top 3   │
                                        │  recommendations │
                                        └────────┬────────┘
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │  Frontend parses │
                                        │  markdown + auto │
                                        │  matches product │
                                        │  names → shows   │
                                        │  clickable cards │
                                        └─────────────────┘
```

### Frontend Features
- **Typewriter animation** — AI text appears character by character
- **Markdown renderer** — `##`, `###`, `**bold**`, `* bullets` render as styled HTML
- **Product auto-matching** — Product names in AI text become clickable cards linking to `/product/:id`
- **3-step onboarding** — Budget presets → Brand selection → Free chat
- **Progress bar** — Visual step indicator (① Budget → ② Brand → ③ Chat)
- **Reset flow** — Change budget/brand anytime

---

## 📡 API Endpoints

### Auth (`/`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/signup` | Register new user (sends verification email) | ❌ |
| `GET` | `/signup/{token}` | Verify email and activate account | ❌ |
| `POST` | `/login` | Login with credentials (sends OTP) | ❌ |
| `POST` | `/verify-otp` | Verify OTP to get access token | ❌ |
| `POST` | `/forgotpassword` | Send password reset email | ❌ |
| `PUT` | `/resetpassword/{token}` | Reset password with token | ❌ |
| `POST` | `/refresh` | Refresh access token | ❌ |
| `POST` | `/google` | Google OAuth login | ❌ |

### Products (`/products`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/products` | List all products | ❌ |
| `GET` | `/products/{id}` | Get single product | ❌ |
| `POST` | `/products` | Create product | 🔐 Admin |
| `PUT` | `/products/{id}` | Update product | 🔐 Admin |
| `DELETE` | `/products/{id}` | Delete product | 🔐 Admin |

### Cart (`/cart`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/cart` | Get user's cart items | 🔐 User |
| `POST` | `/cart` | Add item to cart | 🔐 User |
| `DELETE` | `/cart/{id}` | Remove cart item | 🔐 User |

### Orders (`/orders`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/orders` | Get user's orders | 🔐 User |
| `POST` | `/orders` | Create new order | 🔐 User |

### User Profile
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/profile` | Get user profile | 🔐 User |
| `PUT` | `/profile` | Update profile | 🔐 User |

### AI
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/ai` | Get AI shoe recommendations | 🔐 User |

**AI Request Body:**
```json
{
  "budget": 200,
  "brand": "Nike",
  "text": "Best shoes for running"
}
```

---

## 🗃️ Database Schema

```
┌──────────────────┐       ┌──────────────────┐
│     users         │       │    products       │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ email (unique)   │       │ title            │
│ username (unique)│       │ description      │
│ password (hash)  │       │ price (float)    │
│ role             │       │ brand            │
│ is_verify (bool) │       │ sizes (array)    │
│ otp (int)        │       │ image_url        │
└────────┬─────────┘       └────────┬─────────┘
         │                          │
         │ 1:N                      │ 1:N
         ▼                          ▼
┌──────────────────┐       ┌──────────────────┐
│   cart_items      │       │   cart_items      │
├──────────────────┤       │   (same table)    │
│ id (PK)          │       └──────────────────┘
│ user_id (FK)     │
│ product_id (FK)  │
│ quantity         │
│ size             │
└──────────────────┘

┌──────────────────┐       ┌──────────────────┐
│    orders         │       │   addresses       │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ user_id (FK)     │       │ user_id (FK)     │
│ total            │       │ street           │
│ status           │       │ city             │
│ created_at       │       │ state            │
└──────────────────┘       │ zip_code         │
                           └──────────────────┘
```

---

## 🎨 Frontend Pages

| Page | Route | Description |
|---|---|---|
| **Home** | `/` | Hero, brand marquee, product carousel, AI section, trust badges, CTA |
| **Products** | `/products` | Full catalog with search & brand filtering |
| **Product Detail** | `/product/:id` | Single product view with sizes, add to cart |
| **Login** | `/login` | Email/password + OTP verification |
| **Signup** | `/signup` | Registration with email verification |
| **Verify Email** | `/verify-email` | Email verification landing |
| **Forgot Password** | `/forgot-password` | Password reset request |
| **Reset Password** | `/reset-password/:token` | Set new password |
| **Cart** | `/cart` | 🔐 Shopping cart management |
| **Checkout** | `/checkout` | 🔐 Order placement |
| **Orders** | `/orders` | 🔐 Order history |
| **Profile** | `/profile` | 🔐 User account settings |
| **Admin** | `/admin` | 🔐 Admin panel (admin role only) |

### Design System
- **Theme:** Dark mode with glassmorphism (`backdrop-filter: blur`)
- **Accent Color:** Electric Blue (`#0A84FF`)
- **Typography:** Inter font family
- **Animations:** Framer Motion + custom CSS keyframes
- **Utilities:** `ios-glass`, `ios-curve`, `neon-glow`, `accent-glow`

---

## 📁 Project Structure

```
e-com/
├── main.py                    # FastAPI app entry point
├── config.py                  # Environment variables & settings
├── requirements.txt           # Python dependencies
├── alembic.ini                # Database migration config
│
├── database/
│   └── db.py                  # SQLAlchemy engine, session, Base
│
├── auth/
│   ├── auth.py                # JWT token creation & verification
│   ├── password.py            # Bcrypt password hashing
│   ├── email.py               # Email sending (verification, OTP, reset)
│   ├── eamil_auth.py          # Email token generation
│   ├── forgotpass.py          # Forgot password logic
│   ├── googleauth.py          # Google OAuth verification
│   ├── routes/
│   │   └── authroutes.py      # Signup, Login, OTP, Google, Reset
│   └── schemas/
│       └── signupschemas.py   # Pydantic models for auth
│
├── products/
│   ├── models/
│   │   └── products_model.py  # Product SQLAlchemy model
│   ├── routes/
│   │   └── productroute.py    # Product CRUD endpoints
│   ├── scemas/                # Pydantic schemas for products
│   └── services/              # Business logic layer
│
├── cart/
│   ├── models/                # Cart item model
│   ├── routes/                # Cart CRUD endpoints
│   └── schemas/               # Cart Pydantic schemas
│
├── orders/
│   ├── models/                # Order model
│   ├── routes/                # Order endpoints
│   └── schemas/               # Order Pydantic schemas
│
├── users/
│   ├── models/
│   │   ├── usermodel.py       # User SQLAlchemy model
│   │   └── address.py         # Address model
│   ├── routes/
│   │   ├── profileroutes.py   # Profile endpoints
│   │   └── addressroutes.py   # Address endpoints
│   └── schemas/               # User Pydantic schemas
│
├── admin/
│   ├── routes/                # Admin-only endpoints
│   └── schemas/               # Admin schemas
│
├── Ai/
│   ├── aisetup.py             # Gemini AI client setup
│   ├── routes/
│   │   └── airoutes.py        # AI recommendation endpoint
│   └── schemas/
│       └── aiinput.py         # AI request Pydantic schema
│
├── migrations/                # Alembic migration files
│
└── frontend/                  # React 19 + Vite application
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx           # React entry point
        ├── App.jsx            # Router & providers setup
        ├── index.css          # Design system & animations
        ├── components/
        │   ├── AiAgent.jsx    # 🤖 AI chatbot panel
        │   ├── Navbar.jsx     # Navigation with search
        │   ├── Hero.jsx       # Landing hero section
        │   ├── ProductCard.jsx # Product card component
        │   ├── Footer.jsx     # Site footer
        │   ├── LoadingSkeleton.jsx
        │   ├── SizeSelector.jsx
        │   └── ...
        ├── pages/
        │   ├── Home.jsx       # Landing page with 6 sections
        │   ├── Products.jsx   # Product catalog
        │   ├── ProductDetail.jsx
        │   ├── Login.jsx      # Login + OTP flow
        │   ├── Signup.jsx     # Registration
        │   ├── Cart.jsx
        │   ├── Checkout.jsx
        │   ├── Orders.jsx
        │   ├── Profile.jsx
        │   ├── Admin.jsx      # Admin dashboard
        │   └── ...
        ├── context/
        │   ├── AuthContext.jsx # Auth state management
        │   └── CartContext.jsx # Cart state management
        ├── hooks/
        │   └── useProducts.js # Products data fetching hook
        ├── services/
        │   └── api.js         # Axios instance + JWT interceptor
        ├── lib/
        │   ├── ticker.js      # Price formatting utilities
        │   └── motion.js      # Animation variants
        └── routes/
            └── ProtectedRoute.jsx # Auth & role guard
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **PostgreSQL** (running locally or cloud-hosted)
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/kicks-ecommerce.git
cd kicks-ecommerce
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv .venv

# Activate it
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables (see .env section below)

# Run database migrations
alembic upgrade head

# Start the server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

### 4. Access the App
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs
- **API Docs (ReDoc):** http://localhost:8000/redoc

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# Database
dbconnection=postgresql://user:password@localhost:5432/kicks_db

# JWT Secrets
SECRET_KEY=your-secret-key-here
REFRESH_SECRET_KEY=your-refresh-secret-key-here

# Email (SMTP)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key
```

---

## 📸 Screenshots

> *Add screenshots of your app here. Suggested captures:*
> 1. Home page hero section
> 2. Product catalog with brand filtering
> 3. AI Agent panel (budget → brand → chat flow)
> 4. AI recommendation with product cards
> 5. Login/Signup with OTP
> 6. Cart & Checkout
> 7. Admin panel
> 8. Mobile responsive view

---

## 📄 License

This project is built for educational and portfolio purposes.

---

<p align="center">
  <strong>Built with ❤️ using FastAPI + React + Gemini AI</strong>
</p>
