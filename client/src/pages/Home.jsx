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
  ShieldCheck
} from 'lucide-react';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
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
          setFeaturedCourses(courseRes.value.data.courses.slice(0, 4));
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

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-white pt-16 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 text-brand-800 text-xs font-semibold tracking-wide border border-brand-200 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Next-Gen Academic Certification</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Learn Skills. <br />
                Complete Courses. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-700 to-accent-600">
                  Earn Certificates.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Build practical knowledge through structured online courses and earn verifiable certificates when you complete your learning journey.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-600/25 hover:shadow-brand-600/35 hover:-translate-y-0.5 transition-all text-sm"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/verify"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:border-slate-300 transition-all text-sm"
                >
                  <FileCheck2 className="w-4 h-4 text-brand-600" />
                  <span>Verify Certificate</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/60 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Free Access</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">Instant</div>
                  <div className="text-xs text-slate-500 font-medium">Quiz Scoring</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">Official</div>
                  <div className="text-xs text-slate-500 font-medium">PDF Credentials</div>
                </div>
              </div>

            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 shadow-slate-200/60">
                {/* Decorative Top Pill */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <span className="text-xs font-mono text-slate-400">CertifyHub LMS</span>
                </div>

                {/* Simulated Certificate Snippet */}
                <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-brand-950 text-white shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-accent-500/10 rounded-full blur-xl"></div>
                  <div className="flex justify-between items-start">
                    <Award className="w-10 h-10 text-amber-400" />
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-amber-300">Verified</span>
                  </div>
                  <div className="mt-4">
                    <p className="text-[10px] text-slate-300 uppercase tracking-wider">Certificate of Completion</p>
                    <h4 className="text-base font-bold text-white mt-1">Full Stack Web Development</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Presented to Alex Morgan</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-300 font-mono">
                    <span>ID: CERT-2026-000101</span>
                    <span className="text-accent-400">Valid & Authenticated</span>
                  </div>
                </div>

                {/* Micro Progress Card */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">Quiz Assessment Passed</h5>
                      <p className="text-[10px] text-slate-500">Score: 100% • Passing: 60%</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Unlocked</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PLATFORM STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{stats.totalCourses || 5}</div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Structured Courses</p>
            </div>

            <div className="flex flex-col items-center text-center p-2 pt-6 lg:pt-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{stats.totalStudents || 2}</div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Active Students</p>
            </div>

            <div className="flex flex-col items-center text-center p-2 pt-6 lg:pt-2">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{stats.certificatesIssued || 1}</div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Certificates Issued</p>
            </div>

            <div className="flex flex-col items-center text-center p-2 pt-6 lg:pt-2">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{stats.completedCourses || 1}</div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Courses Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COURSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold text-brand-600 uppercase tracking-wider">Top Curriculum</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Featured Online Courses</h2>
            <p className="text-sm text-slate-500 mt-1">Curated programs designed for modern software and engineering careers.</p>
          </div>
          <Link
            to="/courses"
            className="mt-4 sm:mt-0 inline-flex items-center space-x-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.length > 0 ? (
            featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400">
              Loading featured courses...
            </div>
          )}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-bold text-brand-600 uppercase tracking-wider">Simple & Proven</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">How CertifyHub Works</h2>
            <p className="text-sm text-slate-500 mt-2">
              Complete your learning path from registration to a globally verifiable credential in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative group hover:border-brand-300 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Choose a Course</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Browse our catalog of Web Development, Python, MySQL, and Data Science courses.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative group hover:border-brand-300 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Learn Lessons</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Watch video modules, read curated resources, and mark completed lessons step-by-step.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative group hover:border-brand-300 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Complete the Quiz</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Test your understanding in the final assessment. Scores are automatically graded on the backend.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative group hover:border-brand-300 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center mb-4">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Earn Certificate</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instantly download your PDF certificate and verify it publicly anywhere in the world.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. VERIFY CERTIFICATE BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent-500/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Trust & Credential Integrity</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Verify an Issued Certificate
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              Employers, institutions, and students can authenticate any CertifyHub credential in real-time.
            </p>

            <form onSubmit={handleVerifySubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. CERT-2026-000101)"
                value={verifyId}
                onChange={(e) => setVerifyId(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-semibold text-sm bg-brand-600 hover:bg-brand-500 text-white shadow-lg transition"
              >
                Verify Now
              </button>
            </form>

            <p className="text-[11px] text-slate-400 pt-2">
              Try sample credential: <button type="button" onClick={() => setVerifyId('CERT-2026-000101')} className="text-amber-300 underline">CERT-2026-000101</button>
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
