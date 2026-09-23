import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Award,
  Calendar,
  User,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Download
} from 'lucide-react';

const VerifyCertificate = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [identifier, setIdentifier] = useState(searchParams.get('id') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async (queryId) => {
    const term = (queryId || identifier).trim();
    if (!term) return;

    try {
      setLoading(true);
      setErrorMsg('');
      setResult(null);

      const res = await API.get(`/certificates/verify/${encodeURIComponent(term)}`);
      if (res.data.success && res.data.valid) {
        setResult(res.data.certificate);
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Certificate not found. Please verify that the credential ID is typed correctly.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setIdentifier(idFromUrl);
      handleVerify(idFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ id: identifier });
    handleVerify();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-200">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>Official Public Credential Registry</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Verify Certificate Authenticity
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Verify accredited certificates issued by CertifyHub. Every credential is encrypted and tamper-proof in our database.
        </p>
      </div>

      {/* Verification Input Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_10px_30px_-5px_rgba(2,132,199,0.08)]">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              required
              placeholder="Enter Certificate Number (e.g. CERT-2026-000101) or Verification Code"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 shadow-md shadow-brand-600/25 transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? 'Searching Registry...' : 'Verify Certificate'}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 px-1 gap-2">
          <span>Format: CERT-YYYY-XXXXXX or VERIFY-XXXXXX</span>
          <div className="flex items-center space-x-1.5">
            <span>Sample:</span>
            <button
              type="button"
              onClick={() => {
                setIdentifier('CERT-2026-000101');
                handleVerify('CERT-2026-000101');
              }}
              className="text-brand-600 font-mono font-bold bg-brand-50 hover:bg-brand-100 border border-brand-200/60 px-2 py-0.5 rounded-md transition"
            >
              CERT-2026-000101
            </button>
          </div>
        </div>
      </div>

      {/* Verification Results */}
      {result && (
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl shadow-emerald-500/5 p-6 sm:p-10 space-y-6 animate-in fade-in duration-300">
          
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Authentic Credential
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  ✓ Certificate Verified
                </h2>
              </div>
            </div>

            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Database Record Confirmed</span>
            </span>
          </div>

          {/* Credential Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Student Scholar</span>
              <p className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <User className="w-4 h-4 text-brand-600" />
                <span>{result.student_name}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Course Completed</span>
              <p className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-brand-600" />
                <span>{result.course_title}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Certificate Number</span>
              <p className="text-sm font-mono font-bold text-slate-900">{result.certificate_number}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Verification Code</span>
              <p className="text-sm font-mono font-bold text-slate-900">{result.verification_code}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Issue Date</span>
              <p className="text-sm font-semibold text-slate-800 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{new Date(result.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Issuing Body</span>
              <p className="text-sm font-semibold text-slate-800 flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{result.issuing_organization || 'CertifyHub Online Academy'}</span>
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-400 font-medium">
              Tamper-proof academic record verified via CertifyHub Registry.
            </span>
            <a
              href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/certificates/${result.certificate_number}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/20 transition hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF Certificate</span>
            </a>
          </div>

        </div>
      )}

      {/* Error state */}
      {errorMsg && (
        <div className="bg-white rounded-3xl border border-red-200 p-8 text-center space-y-3 shadow-lg shadow-red-500/5 animate-in fade-in duration-300">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <XCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Certificate Not Found or Invalid</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">{errorMsg}</p>
        </div>
      )}

    </div>
  );
};

export default VerifyCertificate;
