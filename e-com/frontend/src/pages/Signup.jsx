import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLock, FiMail, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const GOOGLE_CLIENT_ID = '420901561899-edot1hm4db0pp3v7rgm8u87qnv3leurl.apps.googleusercontent.com';

export default function Signup() {
  const { signup, googleLogin, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      navigate('/', { replace: true });
    }
  }, [isLoggedIn]);

  // Initialize Google Sign-In button
  useEffect(() => {
    if (isLoggedIn) return;
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
          text: 'signup_with',
        });
      }
    };
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
  }, [isLoggedIn, handleGoogleResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      toast.error('Please enter all fields');
      return;
    }

    const res = await signup(email, username, password);
    if (res.success) {
      toast.success('Successfully signed up! Please check your inbox to verify your email before logging in.', {
        duration: 6000,
      });
      navigate('/login');
    } else {
      toast.error(res.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative">
      
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md ios-glass rounded-[28px] p-8 relative z-10 text-left space-y-6">
        
        {/* Title details */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-black text-brand-accent tracking-widest uppercase">
            MEMBER REGISTER
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase">
            Join the Club
          </h2>
          <p className="text-xs text-brand-muted leading-relaxed">
            Create an account to track your orders and shop sneaker drops
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          
          {/* Email block */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <FiMail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-white/5 border border-white/10 rounded-[12px] text-white placeholder:text-neutral-500 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none w-full px-4 py-3 pl-10 text-sm"
              />
            </div>
          </div>

          {/* Username block */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <FiUser className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
                className="bg-white/5 border border-white/10 rounded-[12px] text-white placeholder:text-neutral-500 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none w-full px-4 py-3 pl-10 text-sm"
              />
            </div>
          </div>

          {/* Password block */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <FiLock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                className="bg-white/5 border border-white/10 rounded-[12px] text-white placeholder:text-neutral-500 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none w-full px-4 py-3 pl-10 text-sm"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-accent text-black min-h-[44px] rounded-full font-extrabold w-full flex items-center justify-center gap-2 mt-6 text-xs tracking-widest uppercase hover:scale-[1.01] active:scale-[0.99] transition duration-200 cursor-pointer focus:ring-2 focus:ring-brand-accent focus:outline-none shadow-lg shadow-brand-accent/10"
          >
            {loading ? 'Registering...' : 'Sign Up'} <FiArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Google Sign-Up divider + button */}
        <div className="space-y-4 pt-1">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div ref={googleBtnRef} className="w-full flex justify-center [&>div]:!w-full" />
        </div>

        {/* Footer signups link */}
        <div className="text-center pt-2 text-xs text-neutral-400">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-accent font-bold hover:underline">
            Sign In Instead
          </Link>
        </div>

      </div>

    </div>
  );
}
