import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('role') || 'user');
  const [loading, setLoading] = useState(false);

  const isLoggedIn = !!token;
  const isAdmin = role === 'admin';

  // Check if user is admin by probing the /users endpoint (only admin has access)
  const checkAdminRole = async () => {
    try {
      await API.get('/users');
      setRole('admin');
      localStorage.setItem('role', 'admin');
    } catch {
      setRole('user');
      localStorage.setItem('role', 'user');
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      checkAdminRole();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('role');
      setUser(null);
      setRole('user');
    }
  }, [token]);

  // Synchronize token state with Axios background refreshes
  useEffect(() => {
    const handleRefreshed = (e) => {
      setToken(e.detail);
    };
    window.addEventListener('token-refreshed', handleRefreshed);
    return () => window.removeEventListener('token-refreshed', handleRefreshed);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      // OAuth2PasswordRequestForm expects form-urlencoded params
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const res = await API.post('/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return {
        success: true,
        requiresOtp: true,
        tempToken: res.data.access_token,
        msg: res.data.msg || 'OTP sent'
      };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otp, tempToken) => {
    setLoading(true);
    try {
      const res = await API.post(`/verify-otp?otp=${otp}&token=${tempToken}`);
      if (res.data.refresh_token) {
        localStorage.setItem('refresh_token', res.data.refresh_token);
      }
      setToken(res.data.access_token);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'Invalid or expired OTP',
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, username, password) => {
    setLoading(true);
    try {
      await API.post('/signup', { email, username, password });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'Signup failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
  };

  const googleLogin = async (credential) => {
    setLoading(true);
    try {
      const res = await API.post(`/google?token=${credential}`);
      if (res.data.refresh_token) {
        localStorage.setItem('refresh_token', res.data.refresh_token);
      }
      setToken(res.data.access_token);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'Google sign-in failed',
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, user, role, isLoggedIn, isAdmin, loading, login, verifyOtp, signup, logout, googleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
