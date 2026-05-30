import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isAdmin, loading } = useAuth();

  // While we are checking token and role, show a luxury loading page
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-bg">
        <div className="w-12 h-12 border-2 border-brand-muted border-t-brand-accent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold tracking-widest text-brand-muted uppercase animate-pulse">
          Authenticating...
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
