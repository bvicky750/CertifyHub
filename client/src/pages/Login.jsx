import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldAlert, Sparkles, UserCheck, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both your email address and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const data = await login(email, password);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === '/login' ? '/dashboard' : from);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo autofill helpers
  const handleAutofill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg('');
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background soft ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-md w-full space-y-7 bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-[0_15px_35px_-5px_rgba(2,132,199,0.1)]">
        
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2.5 text-brand-900 mb-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-accent-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Certify<span className="text-brand-600">Hub</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back</h2>
          <p className="mt-1 text-xs text-slate-500">
            Sign in to access your enrolled courses, quizzes, and certificates.
          </p>
        </div>

        {/* Demo Fast-Login Pills (Great for College Viva Evaluation) */}
        <div className="p-3.5 rounded-2xl bg-brand-50/80 border border-brand-100 text-xs space-y-2">
          <div className="flex items-center space-x-1.5 font-bold text-brand-900">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>1-Click Viva Demo Login:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleAutofill('student@example.com', 'Student@123')}
              className="px-3 py-2 rounded-xl bg-white border border-brand-200 text-brand-700 font-bold hover:bg-brand-50/90 transition text-left text-[11px] shadow-2xs hover:-translate-y-0.5"
            >
              🎓 Student Demo
              <span className="block text-[9px] text-slate-400 font-normal truncate">student@example.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleAutofill('admin@example.com', 'Admin@123')}
              className="px-3 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold hover:bg-amber-50 transition text-left text-[11px] shadow-2xs hover:-translate-y-0.5"
            >
              🛡️ Admin Demo
              <span className="block text-[9px] text-slate-400 font-normal truncate">admin@example.com</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 hover:underline">
            Register as Student
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
