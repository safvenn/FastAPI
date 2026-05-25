import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { FiCheckCircle, FiXCircle, FiLoader, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('Verification token is missing. Please check your email link.');
        return;
      }

      try {
        // Call the backend GET endpoint for verification
        const res = await API.get(`/signup/${token}`);
        if (res.status === 200 || res.status === 201) {
          setStatus('success');
          toast.success('Email verified successfully!');
        } else {
          setStatus('error');
          setErrorMessage(res.data?.detail || 'Verification failed. The token may be invalid or expired.');
        }
      } catch (err) {
        setStatus('error');
        const detail = err.response?.data?.detail || 'An unexpected error occurred. Please try again later.';
        setErrorMessage(detail);
        toast.error(detail);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-neon/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md glass-card rounded-3xl p-8 relative z-10 text-center space-y-6">
        {status === 'verifying' && (
          <div className="space-y-6 py-8">
            <div className="flex justify-center">
              <FiLoader className="w-16 h-16 text-brand-neon animate-spin" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black text-brand-neon tracking-widest uppercase animate-pulse">
                Verification in Progress
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                Verifying Your Identity
              </h2>
              <p className="text-xs text-brand-muted max-w-xs mx-auto leading-relaxed">
                We are securely validating your email address against our servers. This will only take a moment.
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 py-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-brand-neon/10 rounded-full border border-brand-neon/20 flex items-center justify-center animate-bounce">
                <FiCheckCircle className="w-10 h-10 text-brand-neon" />
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black text-brand-neon tracking-widest uppercase">
                Access Granted
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase text-gradient">
                Welcome to the Club
              </h2>
              <p className="text-xs text-brand-muted max-w-xs mx-auto leading-relaxed">
                Your email has been successfully verified! You are now ready to secure your sneaker drops and track orders.
              </p>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-6 bg-brand-neon text-black font-extrabold text-xs tracking-widest uppercase rounded-full hover:scale-[1.01] active:scale-[0.99] transition duration-200 cursor-pointer shadow-lg shadow-brand-neon/10"
            >
              Sign In to Your Account <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 py-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-full border border-red-500/20 flex items-center justify-center">
                <FiXCircle className="w-10 h-10 text-red-500" />
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black text-red-500 tracking-widest uppercase">
                Verification Failed
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">
                Link Invalid or Expired
              </h2>
              <p className="text-xs text-brand-muted max-w-xs mx-auto leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Link
                to="/signup"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-surface border border-white/10 text-white font-extrabold text-xs tracking-widest uppercase rounded-full hover:bg-brand-surface-hover transition duration-200 cursor-pointer"
              >
                Create a New Account
              </Link>
              <Link
                to="/login"
                className="block text-xs text-brand-muted hover:text-white transition"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
