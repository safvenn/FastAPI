import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowRight, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      // Endpoint is @app.post("/forgotpassword") and expects email as query param
      const res = await API.post(`/forgotpassword?email=${encodeURIComponent(email)}`);
      
      setSubmitted(true);
      toast.success('Reset email sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative">
      
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md ios-glass rounded-[28px] p-8 relative z-10 text-left space-y-6">
        
        {/* Back to Login link */}
        <div className="flex justify-start">
          <Link 
            to="/login" 
            className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 hover:text-brand-accent transition uppercase tracking-widest"
          >
            <FiArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>

        {!submitted ? (
          <>
            {/* Title details */}
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-brand-accent tracking-widest uppercase">
                RECOVER ACCESS
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">
                Forgot Password
              </h2>
              <p className="text-xs text-brand-muted leading-relaxed">
                Enter your email address and we'll send you a secure link to reset your password.
              </p>
            </div>

            {/* Forgot Password Form */}
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
                    id="forgot-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
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
                {loading ? 'Sending Request...' : 'Send Reset Link'} <FiArrowRight className="w-4 h-4" />
              </button>

            </form>
          </>
        ) : (
          <div className="text-center py-6 space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center text-brand-accent animate-bounce">
                <FiCheckCircle className="w-8 h-8" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                Link Dispatched!
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed px-4">
                We've sent a password recovery link to <span className="text-white font-semibold">{email}</span>. 
                Please check your inbox (and spam folder) to complete your password reset.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setSubmitted(false)}
                className="text-[10px] font-bold text-brand-accent hover:underline tracking-widest uppercase"
              >
                Didn't receive email? Try again
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
