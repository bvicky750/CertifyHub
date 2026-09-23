import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import CourseCard from '../components/CourseCard';
import {
  BookOpen,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Search,
  Layers,
  GraduationCap,
  FileCheck2,
  Users,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  Check
} from 'lucide-react';

const CATEGORIES = ['All', 'Web Development', 'Programming', 'Database', 'Data Science'];

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stats, setStats] = useState({
    totalCourses: 5,
    totalStudents: 240,
    certificatesIssued: 180,
    completedCourses: 150
  });
  const [loading, setLoading] = useState(true);
  const [verifyId, setVerifyId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, statRes] = await Promise.allSettled([
          API.get('/courses'),
          API.get('/admin/stats')
        ]);

        if (courseRes.status === 'fulfilled' && courseRes.value.data.courses) {
          setFeaturedCourses(courseRes.value.data.courses);
        }

        if (statRes.status === 'fulfilled' && statRes.value.data.stats) {
          setStats(statRes.value.data.stats);
        }
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (verifyId.trim()) {
      navigate(`/verify?id=${encodeURIComponent(verifyId.trim())}`);
    }
  };

  const filteredCourses = selectedCategory === 'All'
    ? featuredCourses.slice(0, 4)
    : featuredCourses.filter(c => c.category === selectedCategory).slice(0, 4);

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* 1. HERO SECTION WITH AMBIENT GLOW */}
      <section className="relative pt-12 sm:pt-20 pb-20 border-b border-slate-200/70 bg-gradient-to-b from-brand-50/60 via-slate-50/40 to-white">
        {/* Ambient background glow orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-brand-400/15 via-accent-300/15 to-transparent blur-3xl pointer-events-none -z-10 rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Top Shimmer Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-brand-800 text-xs font-bold tracking-wide border border-brand-200/80 shadow-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
                </span>
                <span className="bg-gradient-to-r from-brand-700 to-accent-700 bg-clip-text text-transparent font-extrabold">
                  Official Academic Credential Registry
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 bg-brand-100/80 text-[10px] rounded text-brand-700">v2.0</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Learn Practical Skills. <br />
                Master Coursework. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-700 to-accent-600">
                  Earn Verified Credentials.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Build verifiable career competence through structured lessons, hands-on modules, and automated grading. Earn tamper-proof digital certificates recognized globally.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-brand-600 via-brand-650 to-brand-700 hover:from-brand-500 hover:to-brand-600 shadow-lg shadow-brand-600/30 hover:shadow-brand-600/40 hover:-translate-y-0.5 transition-all text-sm"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/verify"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all text-sm"
                >
                  <FileCheck2 className="w-4 h-4 text-brand-600" />
                  <span>Verify Certificate</span>
                </Link>
              </div>

              {/* Micro Trust Cards */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div className="p-2 rounded-xl bg-white/60 border border-slate-200/60 shadow-2xs">
                  <div className="text-xl sm:text-2xl font-black text-slate-900">100%</div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Free Learning</div>
                </div>
                <div className="p-2 rounded-xl bg-white/60 border border-slate-200/60 shadow-2xs">
                  <div className="text-xl sm:text-2xl font-black text-slate-900">Instant</div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Assessment</div>
                </div>
                <div className="p-2 rounded-xl bg-white/60 border border-slate-200/60 shadow-2xs">
                  <div className="text-xl sm:text-2xl font-black text-slate-900">Official</div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-0.5">PDF Credentials</div>
                </div>
              </div>

            </div>

            {/* Right Hero Visual Card (Elevated 3D Certificate Preview) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_-15px_rgba(2,132,199,0.18)] border border-slate-200/80 card-hover-effect">
                
                {/* Decorative Window Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-slate-400">CertifyHub LMS • Verified Seal</span>
                </div>

                {/* Simulated Certificate Snippet */}
                <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 text-white shadow-xl relative overflow-hidden border border-slate-800">
                  <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-accent-500/20 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-28 h-28 bg-brand-500/20 rounded-full blur-2xl"></div>

                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1 font-bold">
                      <Check className="w-3 h-3" /> Validated
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-[10px] text-amber-300/80 uppercase font-mono tracking-widest">Certificate of Completion</p>
                    <h4 className="text-base font-bold text-white mt-1">Full Stack Web Development</h4>
                    <p className="text-xs text-slate-300 mt-0.5 font-serif italic">Conferred to Alex Morgan</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-300 font-mono">
                    <span className="text-slate-400">ID: CERT-2026-000101</span>
                    <span className="text-accent-400 font-bold">Cryptographically Signed</span>
                  </div>
                </div>

                {/* Micro Passed Quiz Card */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">Quiz Assessment Passed</h5>
                      <p className="text-[10px] text-slate-500 font-medium">Score: 100% • Passing requirement: 60%</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    Unlocked
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PLATFORM STATISTICS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3 shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.totalCourses || 5}</div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Structured Courses</p>
              <span className="mt-1 text-[11px] text-brand-600 font-medium">Modular Curriculum</span>
            </div>

            <div className="flex flex-col items-center text-center p-2 pt-6 lg:pt-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.totalStudents || 240}+</div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Active Students</p>
              <span className="mt-1 text-[11px] text-emerald-600 font-medium">Learning Daily</span>
            </div>

            <div className="flex flex-col items-center text-center p-2 pt-6 lg:pt-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.certificatesIssued || 180}+</div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Certificates Issued</p>
              <span className="mt-1 text-[11px] text-amber-600 font-medium">100% Verifiable</span>
            </div>

            <div className="flex flex-col items-center text-center p-2 pt-6 lg:pt-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.completedCourses || 150}+</div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Evaluations Passed</p>
              <span className="mt-1 text-[11px] text-purple-600 font-medium">Instant Grading</span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED COURSES WITH CATEGORY TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Syllabus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">Featured Online Programs</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Structured learning paths designed for modern software development and data careers.</p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">No courses currently in this category.</p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="mt-3 text-xs font-bold text-brand-600 underline"
              >
                View all courses
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. WHY CERTIFYHUB HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 rounded-3xl text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-accent-400 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Engineered For Academic Excellence</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">Why Choose CertifyHub?</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              An all-in-one learning management system combining interactive coursework, assessment integrity, and verifiable credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3 hover:bg-white/10 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Automated Quiz Scoring</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Backend-graded assessments evaluate your answers in real time with immediate feedback and instant certificate unlock upon passing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3 hover:bg-white/10 transition">
              <div className="w-10 h-10 rounded-xl bg-accent-500/20 text-accent-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Tamper-Proof Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Each certificate is backed by a unique cryptographic certificate ID and verification hash in our public database.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3 hover:bg-white/10 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Exportable PDF Certificates</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download high-resolution, print-ready PDF certificates with official college seals ready to upload to LinkedIn or attach to resumes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="bg-slate-100/70 py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <div className="text-xs font-bold text-brand-600 uppercase tracking-wider">Simple & Proven</div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">How CertifyHub Works</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Four simple steps from your first lesson to receiving an accredited digital credential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative group hover:border-brand-300 card-hover-effect">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 font-extrabold flex items-center justify-center mb-4 text-sm shadow-xs">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Pick a Program</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Browse our catalog of Web Development, Python, MySQL, and Data Science courses.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative group hover:border-brand-300 card-hover-effect">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 font-extrabold flex items-center justify-center mb-4 text-sm shadow-xs">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Learn Lessons</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Study modular video content, review structured notes, and complete practical lessons.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative group hover:border-brand-300 card-hover-effect">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 font-extrabold flex items-center justify-center mb-4 text-sm shadow-xs">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Take the Quiz</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete the multiple-choice final assessment with immediate scoring feedback.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative group hover:border-brand-300 card-hover-effect">
              <div className="w-10 h-10 rounded-2xl bg-accent-50 text-accent-700 font-extrabold flex items-center justify-center mb-4 text-sm shadow-xs">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Earn Certificate</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instantly download your official PDF and verify it publicly from any browser globally.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. VERIFY CERTIFICATE BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent-500/15 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/10">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Public Credential Verification</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Verify an Issued Certificate
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              Employers, university evaluators, and students can authenticate any CertifyHub credential in real-time.
            </p>

            <form onSubmit={handleVerifySubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. CERT-2026-000101)"
                value={verifyId}
                onChange={(e) => setVerifyId(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 focus:bg-white/15 transition"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5"
              >
                Verify Now
              </button>
            </form>

            <div className="text-[11px] text-slate-400 pt-2 flex items-center justify-center space-x-2">
              <span>Try sample:</span>
              <button
                type="button"
                onClick={() => setVerifyId('CERT-2026-000101')}
                className="text-amber-300 hover:underline font-mono bg-white/10 px-2 py-0.5 rounded"
              >
                CERT-2026-000101
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
