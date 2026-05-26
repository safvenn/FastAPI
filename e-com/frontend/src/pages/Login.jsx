import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLock, FiArrowRight, FiKey, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, verifyOtp, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [tempToken, setTempToken] = useState('');

  // Auto redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!showOtp) {
      if (!username || !password) {
        toast.error('Please enter all fields');
        return;
      }

      const res = await login(username, password);
      if (res.success && res.requiresOtp) {
        setTempToken(res.tempToken);
        setShowOtp(true);
        toast.success(res.msg || 'OTP sent! Please check your inbox.');
      } else if (res.success) {
        toast.success('Successfully logged in! Welcome back.');
      } else {
        toast.error(res.error || 'Invalid credentials');
      }
    } else {
      if (!otp) {
        toast.error('Please enter the OTP code');
        return;
      }

      const res = await verifyOtp(otp, tempToken);
      if (res.success) {
        toast.success('Successfully verified OTP! Welcome back.');
      } else {
        toast.error(res.error || 'Invalid OTP code');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative">
      
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-neon/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md glass-card rounded-3xl p-8 relative z-10 text-left space-y-6">
        
        {/* Optional back button when in OTP mode */}
        {showOtp && (
          <div className="flex justify-start">
            <button 
              onClick={() => {
                setShowOtp(false);
                setOtp('');
              }}
              className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 hover:text-brand-neon transition uppercase tracking-widest cursor-pointer"
            >
              <FiArrowLeft className="w-3.5 h-3.5" /> Back to Credentials
            </button>
          </div>
        )}

        {/* Title details */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-black text-brand-neon tracking-widest uppercase">
            {showOtp ? 'SECURE TWO-FACTOR' : 'AUTHENTIC ACCESS'}
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase">
            {showOtp ? 'Verify OTP' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-brand-muted leading-relaxed">
            {showOtp 
              ? 'A 6-digit verification code has been dispatched to your email.' 
              : 'Enter your sneaker club credentials to proceed'}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          
          {!showOtp ? (
            <>
              {/* Username block */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                  Username or Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <FiUser className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    id="login-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username or email"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-brand-surface border border-white/10 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-brand-neon transition"
                  />
                </div>
              </div>

              {/* Password block */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-[9px] text-brand-neon hover:underline font-bold tracking-wider uppercase">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <FiLock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-brand-surface border border-white/10 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-brand-neon transition"
                  />
                </div>
              </div>
            </>
          ) : (
            /* OTP block */
            <div className="space-y-1.5 animate-fade-in">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                Verification Code
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <FiKey className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  id="login-otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-brand-surface border border-white/10 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-brand-neon transition tracking-[0.25em] font-mono text-center"
                />
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 mt-6 bg-brand-neon text-black font-extrabold text-xs tracking-widest uppercase rounded-full hover:scale-[1.01] active:scale-[0.99] transition duration-200 cursor-pointer shadow-lg shadow-brand-neon/10"
          >
            {loading 
              ? (showOtp ? 'Verifying...' : 'Authenticating...') 
              : (showOtp ? 'Verify & Enter' : 'Sign In')} <FiArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Footer signups link */}
        <div className="text-center pt-2 text-xs text-neutral-400">
          New to KICKS?{' '}
          <Link to="/signup" className="text-brand-neon font-bold hover:underline">
            Create an Account
          </Link>
        </div>

      </div>

    </div>
  );
}
