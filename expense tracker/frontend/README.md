# Expense Tracker Frontend

A modern, stylish React frontend for the Expense Tracker application built with React, TypeScript, Tailwind CSS, and Vite.

## Features

- 🔐 **Authentication**: Secure login and signup with JWT tokens
- 💰 **Expense Management**: Add, view, and delete expenses
- 📊 **Analytics**: Visual charts showing expense breakdown by category
- 🤖 **AI Assistant**: Chat with an AI financial advisor for expense insights
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🔍 **Search & Filter**: Find expenses quickly with search and category filters
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Beautiful icons
- **date-fns** - Date formatting

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:8000`

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── AIChat.tsx
│   │   ├── ExpenseChart.tsx
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseList.tsx
│   │   ├── Header.tsx
│   │   ├── PrivateRoute.tsx
│   │   └── StatsCards.tsx
│   ├── context/          # React context
│   │   └── AuthContext.tsx
│   ├── pages/            # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## API Integration

The frontend connects to the following backend endpoints:

- `POST /signup` - User registration
- `POST /login` - User authentication
- `GET /userexpenses` - Fetch user expenses
- `POST /expense` - Add new expense
- `DELETE /delete?i={id}` - Delete expense
- `POST /chat?chat={message}` - AI chat assistant

## Features Overview

### Dashboard
- View total expenses and statistics
- Visual charts for expense analytics
- Quick expense overview cards

### Expense Management
- Add expenses with title, amount, category, and description
- Search and filter expenses
- Delete expenses with confirmation

### AI Assistant
- Chat interface for financial advice
- Context-aware responses based on your expenses
- Helpful tips for saving money

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme.

### Categories
Modify the `categories` array in `ExpenseForm.tsx` to add/remove expense categories.

### API URL
Update the base URL in axios calls if your backend runs on a different port.

## License

MIT
