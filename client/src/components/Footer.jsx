import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const [certInput, setCertInput] = useState('');
  const navigate = useNavigate();

  const handleQuickVerify = (e) => {
    e.preventDefault();
    if (certInput.trim()) {
      navigate(`/verify?id=${encodeURIComponent(certInput.trim())}`);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-10 border-t border-slate-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5 text-white group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight">
                Certify<span className="text-accent-400">Hub</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering students and professionals with rigorous curriculums, hands-on modules, automated assessment scoring, and verifiable academic certifications.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <div className="inline-flex items-center space-x-2 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-400" />
                <span>Tamper-proof Digital Verification</span>
              </div>
              <div className="inline-flex items-center space-x-2 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-slate-900 text-emerald-400 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>All Systems Operational</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs mb-4 tracking-wider uppercase">Explore Curriculum</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/courses" className="hover:text-white transition">All Courses</Link>
              </li>
              <li>
                <Link to="/courses?category=Web%20Development" className="hover:text-white transition">Web Development</Link>
              </li>
              <li>
                <Link to="/courses?category=Programming" className="hover:text-white transition">Programming</Link>
              </li>
              <li>
                <Link to="/courses?category=Database" className="hover:text-white transition">Databases & SQL</Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-white transition">Verify Credentials</Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-bold text-xs mb-4 tracking-wider uppercase">Student Portal</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/login" className="hover:text-white transition">Student Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">Register Account</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">Learning Dashboard</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition">Faculty & Admin</Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Accreditation Standards</span>
              </li>
            </ul>
          </div>

          {/* Instant Verification Widget */}
          <div>
            <h4 className="text-white font-bold text-xs mb-4 tracking-wider uppercase">Instant Validation</h4>
            <p className="text-xs text-slate-400 mb-3">
              Validate any student credential number directly:
            </p>
            <form onSubmit={handleQuickVerify} className="space-y-2">
              <input
                type="text"
                placeholder="e.g. CERT-2026-000101"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-1.5 px-3 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 rounded-xl transition shadow-md shadow-brand-600/20"
              >
                <span>Check Credential</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CertifyHub Portal • College Project • Full Stack Engineering.</p>
          <div className="flex flex-wrap items-center space-x-4 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">React + Vite</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Node + Express</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">MySQL Database</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
