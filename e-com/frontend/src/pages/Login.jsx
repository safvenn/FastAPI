import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLock, FiArrowRight, FiKey, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const GOOGLE_CLIENT_ID = '420901561899-edot1hm4db0pp3v7rgm8u87qnv3leurl.apps.googleusercontent.com';

export default function Login() {
  const { login, verifyOtp, googleLogin, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [tempToken, setTempToken] = useState('');
  const googleBtnRef = useRef(null);

  // Google credential callback
  const handleGoogleResponse = useCallback(async (response) => {
    const res = await googleLogin(response.credential);
    if (res.success) {
      toast.success('Signed in with Google!');
    } else {
      toast.error(res.error || 'Google sign-in failed');
    }
  }, [googleLogin]);

  // Auto redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isLoggedIn]);

  // Initialize Google Sign-In button
  useEffect(() => {
    if (isLoggedIn || showOtp) return;
    const initGoogle = () => {
      if (window.google?.accounts?.id && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          width: googleBtnRef.current.offsetWidth,
          shape: 'pill',
          text: 'signin_with',
        });
      }
    };
    // GSI script may load after component mount
    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(timer);
          initGoogle();
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isLoggedIn, showOtp, handleGoogleResponse]);

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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md ios-glass rounded-[28px] p-8 relative z-10 text-left space-y-6">
        
        {/* Optional back button when in OTP mode */}
        {showOtp && (
          <div className="flex justify-start">
            <button 
              onClick={() => {
                setShowOtp(false);
                setOtp('');
              }}
              className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 hover:text-brand-accent transition uppercase tracking-widest cursor-pointer"
            >
              <FiArrowLeft className="w-3.5 h-3.5" /> Back to Credentials
            </button>
          </div>
        )}

        {/* Title details */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-black text-brand-accent tracking-widest uppercase">
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
                    className="bg-white/5 border border-white/10 rounded-[12px] text-white placeholder:text-neutral-500 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none w-full px-4 py-3 pl-10 text-sm"
                  />
                </div>
              </div>

              {/* Password block */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-[9px] text-brand-accent hover:underline font-bold tracking-wider uppercase">
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
                    className="bg-white/5 border border-white/10 rounded-[12px] text-white placeholder:text-neutral-500 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none w-full px-4 py-3 pl-10 text-sm"
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
                  className="bg-white/5 border border-white/10 rounded-[12px] text-white placeholder:text-neutral-500 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none w-full px-4 py-3 pl-10 text-sm tracking-[0.25em] font-mono text-center"
                />
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-accent text-black min-h-[44px] rounded-full font-extrabold w-full flex items-center justify-center gap-2 mt-6 text-xs tracking-widest uppercase hover:scale-[1.01] active:scale-[0.99] transition duration-200 cursor-pointer focus:ring-2 focus:ring-brand-accent focus:outline-none shadow-lg shadow-brand-accent/10"
          >
            {loading 
              ? (showOtp ? 'Verifying...' : 'Authenticating...') 
              : (showOtp ? 'Verify & Enter' : 'Sign In')} <FiArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Google Sign-In divider + button */}
        {!showOtp && (
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div ref={googleBtnRef} className="w-full flex justify-center [&>div]:!w-full" />
          </div>
        )}

        {/* Footer signups link */}
        <div className="text-center pt-2 text-xs text-neutral-400">
          New to KICKS?{' '}
          <Link to="/signup" className="text-brand-accent font-bold hover:underline">
            Create an Account
          </Link>
        </div>

      </div>

    </div>
  );
}
