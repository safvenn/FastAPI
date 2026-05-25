import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLock, FiMail, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Signup() {
  const { signup, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Auto redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      toast.error('Please enter all fields');
      return;
    }

    const res = await signup(email, username, password);
    if (res.success) {
      toast.success('Successfully signed up! Please log in with your credentials.');
      navigate('/login');
    } else {
      toast.error(res.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative">
      
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-neon/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md glass-card rounded-3xl p-8 relative z-10 text-left space-y-6">
        
        {/* Title details */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-black text-brand-neon tracking-widest uppercase">
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
                className="w-full pl-10 pr-4 py-3 bg-brand-surface border border-white/10 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-brand-neon transition"
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
                className="w-full pl-10 pr-4 py-3 bg-brand-surface border border-white/10 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-brand-neon transition"
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
                className="w-full pl-10 pr-4 py-3 bg-brand-surface border border-white/10 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-brand-neon transition"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 mt-6 bg-brand-neon text-black font-extrabold text-xs tracking-widest uppercase rounded-full hover:scale-[1.01] active:scale-[0.99] transition duration-200 cursor-pointer shadow-lg shadow-brand-neon/10"
          >
            {loading ? 'Registering...' : 'Sign Up'} <FiArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Footer signups link */}
        <div className="text-center pt-2 text-xs text-neutral-400">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-neon font-bold hover:underline">
            Sign In Instead
          </Link>
        </div>

      </div>

    </div>
  );
}
