import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import CertificateModal from '../components/CertificateModal';
import {
  BookOpen,
  CheckCircle2,
  Award,
  TrendingUp,
  Clock,
  ArrowRight,
  Download,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const [enrollRes, certRes] = await Promise.allSettled([
          API.get('/enrollments/my'),
          API.get('/certificates/my')
        ]);

        if (enrollRes.status === 'fulfilled' && enrollRes.value.data.enrollments) {
          setEnrollments(enrollRes.value.data.enrollments);
        }

        if (certRes.status === 'fulfilled' && certRes.value.data.certificates) {
          setCertificates(certRes.value.data.certificates);
        }
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading your student learning dashboard..." />;
  }

  const enrolledCount = enrollments.length;
  const completedCount = enrollments.filter((e) => e.enrollment_status === 'completed').length;
  const certCount = certificates.length;
  const avgProgress = enrolledCount > 0
    ? Math.round(enrollments.reduce((acc, curr) => acc + (curr.progress || 0), 0) / enrolledCount)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. WELCOME HEADER WITH LUXURY SLATE GRADIENT */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2.5 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
            <GraduationCap className="w-4 h-4 text-brand-400" />
            <span>Student Learning Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Track your ongoing coursework, complete lessons, and unlock verifiable industry-recognized certificates.
          </p>
        </div>

        <Link
          to="/courses"
          className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 hover:shadow-brand-600/40 transition hover:-translate-y-0.5 shrink-0 relative z-10"
        >
          <span>Browse More Courses</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center space-x-4 card-hover-effect">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Enrolled Courses</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{enrolledCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center space-x-4 card-hover-effect">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{completedCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center space-x-4 card-hover-effect">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Certificates</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{certCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center space-x-4 card-hover-effect">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-xs">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg. Progress</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{avgProgress}%</h3>
          </div>
        </div>
      </div>

      {/* 3. CONTINUE LEARNING (ENROLLED COURSES) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Coursework</h2>
            <p className="text-xs text-slate-500">Pick up right where you left off</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {enrolledCount} Active Program{enrolledCount !== 1 && 's'}
          </span>
        </div>

        {enrolledCount > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((item) => (
              <div
                key={item.enrollment_id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px]">
                      {item.category}
                    </span>
                    <span
                      className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                        item.enrollment_status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                          : 'bg-brand-50 text-brand-700 border border-brand-200/80'
                      }`}
                    >
                      {item.enrollment_status === 'completed' ? '✓ Completed' : 'In Progress'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1">
                    {item.course_title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {item.short_description}
                  </p>

                  <div className="space-y-2 mb-4 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                      <span>Progress</span>
                      <span>{item.progress || 0}%</span>
                    </div>
                    <ProgressBar progress={item.progress} size="md" color={item.progress === 100 ? 'emerald' : 'brand'} />
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                      <span>{item.completed_lessons} of {item.total_lessons} lessons completed</span>
                      <span>Level: {item.level}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    to={`/learn/${item.course_id}`}
                    className="w-full text-center py-3 px-4 rounded-2xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/20 hover:shadow-brand-600/30 transition flex items-center justify-center space-x-2"
                  >
                    <span>{item.progress === 100 ? 'Review Course / Quiz' : 'Continue Learning'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="You haven't enrolled in any courses yet."
            message="Explore our collection of technical courses and kickstart your learning journey today."
            actionText="Explore Courses"
            actionLink="/courses"
          />
        )}
      </section>

      {/* 4. EARNED CERTIFICATES */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Earned Certificates</h2>
            <p className="text-xs text-slate-500">Your verified academic credentials</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {certCount} Issued
          </span>
        </div>

        {certCount > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {cert.course_title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Issued on {new Date(cert.issue_date).toLocaleDateString()}
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 mt-1 bg-slate-50 px-2 py-0.5 rounded inline-block">
                      ID: {cert.certificate_number}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => setSelectedCert(cert)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200/70 transition shadow-2xs"
                  >
                    View Credential
                  </button>
                  <a
                    href={`/verify?id=${encodeURIComponent(cert.certificate_number)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 text-slate-400 hover:text-brand-600 rounded-xl hover:bg-slate-100 border border-slate-200/70 transition"
                    title="Public Verification"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 text-center space-y-2">
            <Award className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No certificates earned yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Complete all lessons in an enrolled course and achieve a passing score on the final assessment to receive your official certificate.
            </p>
          </div>
        )}
      </section>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={!!selectedCert}
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />

    </div>
  );
};

export default Dashboard;
