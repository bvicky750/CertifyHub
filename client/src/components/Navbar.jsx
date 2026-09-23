import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  Award,
  User,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 text-brand-900 group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 group-hover:rotate-1 transition-all duration-300">
                <GraduationCap className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Certify<span className="bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">Hub</span>
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-brand-50 text-brand-700 text-[10px] font-bold border border-brand-200/60 hidden sm:inline-block">
                  LMS 2.0
                </span>
              </div>
              <span className="hidden sm:block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Online Academy & Certification
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive('/')
                  ? 'text-brand-700 bg-brand-50/90 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Home
            </Link>

            <Link
              to="/courses"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive('/courses')
                  ? 'text-brand-700 bg-brand-50/90 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Courses
            </Link>

            <Link
              to="/verify"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                isActive('/verify')
                  ? 'text-brand-700 bg-brand-50/90 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Award className="w-4 h-4 text-accent-600" />
              <span>Verify Certificate</span>
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      location.pathname.startsWith('/admin')
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-amber-200/50'
                        : 'bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Admin Panel</span>
                  </Link>
                ) : null}

                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isActive('/dashboard')
                      ? 'bg-brand-600 text-white shadow-brand-500/25 ring-2 ring-brand-500/30'
                      : 'bg-brand-50 text-brand-700 border border-brand-200/70 hover:bg-brand-100/80'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Student Dashboard</span>
                </Link>

                <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-brand-500/40 ring-offset-2 bg-slate-100 shadow-sm">
                      <img
                        src={user?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0284c7&color=fff`}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign out"
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-brand-700 hover:bg-slate-100/80 rounded-xl transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 rounded-xl shadow-md shadow-brand-600/25 hover:shadow-brand-600/40 hover:-translate-y-0.5 transition-all"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
              isActive('/') ? 'text-brand-700 bg-brand-50' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-brand-600" />
            <span>Home</span>
          </Link>
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
              isActive('/courses') ? 'text-brand-700 bg-brand-50' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-brand-600" />
            <span>Courses Catalog</span>
          </Link>
          <Link
            to="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
              isActive('/verify') ? 'text-brand-700 bg-brand-50' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4 text-accent-600" />
            <span>Verify Certificate</span>
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-600 shadow-md shadow-brand-600/20"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Student Dashboard</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-sm font-bold text-amber-900 bg-amber-100 border border-amber-300"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Admin Control Panel</span>
                </Link>
              )}
              <div className="flex items-center justify-between px-3 py-2 text-slate-600 bg-slate-50 rounded-xl mt-2">
                <span className="text-xs font-semibold text-slate-800">{user?.name} ({user?.role})</span>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-600 hover:underline flex items-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 text-slate-700 hover:bg-slate-100 rounded-xl font-bold text-xs"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 text-white bg-brand-600 hover:bg-brand-700 rounded-xl font-bold text-xs shadow-md shadow-brand-600/20"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
