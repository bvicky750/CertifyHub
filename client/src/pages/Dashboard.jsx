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
      
      {/* 1. WELCOME HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
            <GraduationCap className="w-4 h-4 text-brand-400" />
            <span>Student Learning Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Track your ongoing coursework, complete upcoming modules, and collect verifiable industry certificates.
          </p>
        </div>

        <Link
          to="/courses"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition shrink-0"
        >
          <span>Browse More Courses</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Courses</p>
            <h3 className="text-2xl font-black text-slate-900">{enrolledCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Courses</p>
            <h3 className="text-2xl font-black text-slate-900">{completedCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Certificates Earned</p>
            <h3 className="text-2xl font-black text-slate-900">{certCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Progress</p>
            <h3 className="text-2xl font-black text-slate-900">{avgProgress}%</h3>
          </div>
        </div>
      </div>

      {/* 3. CONTINUE LEARNING (ENROLLED COURSES) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Active Coursework</h2>
            <p className="text-xs text-slate-500">Pick up right where you left off</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {enrolledCount} Active Program{enrolledCount !== 1 && 's'}
          </span>
        </div>

        {enrolledCount > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((item) => (
              <div
                key={item.enrollment_id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                        item.enrollment_status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-brand-50 text-brand-700'
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

                  <div className="space-y-2 mb-4">
                    <ProgressBar progress={item.progress} size="md" />
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>{item.completed_lessons} of {item.total_lessons} lessons completed</span>
                      <span>Level: {item.level}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/learn/${item.course_id}`}
                    className="w-full text-center py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition flex items-center justify-center space-x-1.5"
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
            <h2 className="text-xl font-bold text-slate-900">Earned Certificates</h2>
            <p className="text-xs text-slate-500">Your verified academic credentials</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">{certCount} Issued</span>
        </div>

        {certCount > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {cert.course_title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Issued: {new Date(cert.issue_date).toLocaleDateString()}
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 mt-1">
                      ID: {cert.certificate_number}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => setSelectedCert(cert)}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 transition"
                  >
                    View Credential
                  </button>
                  <a
                    href={`/verify?id=${encodeURIComponent(cert.certificate_number)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                    title="Public Verification"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center space-y-2">
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
