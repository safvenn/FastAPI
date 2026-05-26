import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiLock, FiArrowRight, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../services/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(4);

  // Auto redirect countdown
  useEffect(() => {
    let timer;
    if (success && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (success && countdown === 0) {
      navigate('/login');
    }
    return () => clearTimeout(timer);
  }, [success, countdown, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Calls @app.put("/resetpassword/{token}") with body params
      const res = await API.put(`/resetpassword/${token}`, {
        new_password: newPassword,
        confirm_pass: confirmPassword
      });

      setSuccess(true);
      toast.success('Password reset successfully!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid or expired reset token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative">
      
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-neon/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md glass-card rounded-3xl p-8 relative z-10 text-left space-y-6">
        
        {!success ? (
          <>
            {/* Title details */}
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-brand-neon tracking-widest uppercase">
                SECURITY CHECK
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">
                Reset Password
              </h2>
              <p className="text-xs text-brand-muted leading-relaxed">
                Choose a strong new password to secure your account.
              </p>
            </div>

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              
              {/* New Password block */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <FiLock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    id="reset-new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-brand-surface border border-white/10 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-brand-neon transition"
                  />
                </div>
              </div>

              {/* Confirm Password block */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <FiLock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    id="reset-confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-brand-surface border border-white/10 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-brand-neon transition"
                  />
                </div>
              </div>

              {/* Password indicator info */}
              {newPassword && (
                <div className="text-[10px] font-semibold flex items-center gap-1.5 p-2 bg-white/5 border border-white/5 rounded-lg text-neutral-400">
                  <FiAlertCircle className="w-3.5 h-3.5 text-brand-neon" />
                  <span>Password should be at least 6 characters.</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 mt-6 bg-brand-neon text-black font-extrabold text-xs tracking-widest uppercase rounded-full hover:scale-[1.01] active:scale-[0.99] transition duration-200 cursor-pointer shadow-lg shadow-brand-neon/10"
              >
                {loading ? 'Updating Password...' : 'Reset Password'} <FiArrowRight className="w-4 h-4" />
              </button>

            </form>
          </>
        ) : (
          <div className="text-center py-6 space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-brand-neon/10 border border-brand-neon/30 flex items-center justify-center text-brand-neon animate-bounce">
                <FiCheckCircle className="w-8 h-8" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                Password Restored!
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed px-4">
                Your new sneaker club credentials are ready. Redirecting to the Login page in{' '}
                <span className="text-brand-neon font-black">{countdown}</span> seconds...
              </p>
            </div>

            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 py-2 px-6 bg-brand-neon text-black font-extrabold text-[10px] tracking-widest uppercase rounded-full hover:scale-105 transition"
              >
                Go to Sign In Immediately
              </Link>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
