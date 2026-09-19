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
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Certify<span className="text-accent-500">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering global learners with rigorous curriculum, hands-on modular projects, instant quiz evaluations, and verifiable academic certifications.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-500" />
                <span>Tamper-proof Digital Verification System</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Explore</h4>
            <ul className="space-y-2.5 text-sm">
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
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-white transition">Student Portal</Link>
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
              <li>
                <span className="text-slate-500 cursor-default">Privacy Policy</span>
              </li>
            </ul>
          </div>

          {/* Instant Verification Widget */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Quick Verify</h4>
            <p className="text-xs text-slate-400 mb-3">
              Validate any student certificate number instantly:
            </p>
            <form onSubmit={handleQuickVerify} className="space-y-2">
              <input
                type="text"
                placeholder="e.g. CERT-2026-000101"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition"
              >
                <span>Check Credential</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CertifyHub Portal. College Mini Project — Full Stack Engineering.</p>
          <div className="flex space-x-6">
            <span>Built with React + Express + MySQL</span>
            <span>REST API Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
