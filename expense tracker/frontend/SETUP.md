# Frontend Setup Guide

## Quick Start

Follow these steps to get your React frontend up and running:

### 1. Install Dependencies

Open a terminal in the `frontend` directory and run:

```bash
npm install
```

This will install all required packages including:
- React & React DOM
- TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (navigation)
- Axios (API calls)
- Recharts (charts)
- Lucide React (icons)
- date-fns (date formatting)

### 2. Start the Backend

Make sure your FastAPI backend is running on `http://localhost:8000`:

```bash
# In the root directory (not frontend)
uvicorn main:app --reload
```

### 3. Start the Frontend

In the `frontend` directory, run:

```bash
npm run dev
```

The app will start on `http://localhost:3000`

### 4. Open in Browser

Navigate to `http://localhost:3000` and you should see the login page!

## Default Test Account

If you don't have an account yet, click "Sign up" to create one.

## Features to Try

1. **Sign Up / Login** - Create an account or log in
2. **Add Expenses** - Use the form to add new expenses
3. **View Analytics** - See beautiful charts of your spending
4. **Search & Filter** - Find specific expenses quickly
5. **AI Chat** - Click the chat button in the bottom right to talk to your AI financial assistant
6. **Delete Expenses** - Remove expenses you no longer need

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, Vite will automatically try the next available port (3001, 3002, etc.)

### Backend Connection Issues

Make sure:
- Your backend is running on port 8000
- CORS is enabled in your FastAPI app (it already is!)
- The API URL in the frontend matches your backend URL

### Module Not Found Errors

Try deleting `node_modules` and reinstalling:

```bash
rm -rf node_modules
npm install
```

## Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist` directory. You can serve them with any static file server.

## Environment Variables (Optional)

If you want to change the API URL, create a `.env` file in the frontend directory:

```
VITE_API_URL=http://localhost:8000
```

Then update the axios calls to use `import.meta.env.VITE_API_URL`

## Tech Stack Summary

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Axios** - Promise-based HTTP client
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful icon library

Enjoy your new expense tracker! 🎉
