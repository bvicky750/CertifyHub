import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import {
  Clock,
  BookOpen,
  User,
  Award,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileText,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [openModules, setOpenModules] = useState({ 0: true, 1: true });
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/courses/${id}`);
        if (res.data.success) {
          const courseData = res.data.course;
          setCourse(courseData);

          // If logged in, check enrollment status
          if (isAuthenticated) {
            try {
              const enrollRes = await API.get(`/enrollments/${courseData.id}`);
              if (enrollRes.data.success) {
                setEnrollmentStatus(enrollRes.data);
              }
            } catch (err) {
              console.warn('Enrollment check failed:', err);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndEnrollment();
  }, [id, isAuthenticated]);

  const toggleModule = (index) => {
    setOpenModules((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    try {
      setEnrolling(true);
      setFeedbackMsg('');
      const res = await API.post('/enrollments', { courseId: course.id });
      if (res.data.success) {
        setFeedbackMsg('Successfully enrolled! Redirecting to learning interface...');
        setTimeout(() => {
          navigate(`/learn/${course.id}`);
        }, 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to enroll in this course. Please try again.';
      setFeedbackMsg(msg);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading course details & syllabus..." />;
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">Course not found</h2>
        <p className="text-sm text-slate-500 mt-2">The course you are looking for does not exist or has been unpublished.</p>
        <Link to="/courses" className="mt-4 inline-block px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg">
          Browse Courses
        </Link>
      </div>
    );
  }

  const isEnrolled = enrollmentStatus?.enrolled;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center space-x-2">
        <Link to="/courses" className="hover:text-brand-600">Courses</Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">{course.category}</span>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-xs">{course.title}</span>
      </nav>

      {/* Hero Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              {course.category}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              Level: {course.level}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              Verifiable Certificate
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {course.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {course.short_description || course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                {course.instructor_name.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Instructor</p>
                <p className="font-semibold text-slate-800">{course.instructor_name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Duration</p>
                <p className="font-semibold text-slate-800">{course.duration}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Curriculum</p>
                <p className="font-semibold text-slate-800">
                  {course.module_count} Modules • {course.lesson_count} Lessons
                </p>
              </div>
            </div>
          </div>

          {/* Feedback message */}
          {feedbackMsg && (
            <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-800 text-xs font-medium">
              {feedbackMsg}
            </div>
          )}

          {/* Call to action */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            {isEnrolled ? (
              <Link
                to={`/learn/${course.id}`}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition text-sm"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-600/25 transition text-sm disabled:opacity-50"
              >
                <span>{enrolling ? 'Enrolling...' : 'Enroll in Course Now — Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {isEnrolled && (
              <div className="flex-1 max-w-xs flex flex-col justify-center">
                <ProgressBar progress={enrollmentStatus.progress} size="md" />
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Visual Preview */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="rounded-2xl overflow-hidden aspect-video border border-slate-200 shadow-inner bg-slate-100">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900">What You Will Gain:</h4>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full lifetime access to comprehensive video tutorials & notes</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Step-by-step lesson completion progress tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Automated final quiz evaluation with instant grading</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Accredited CertifyHub Certificate downloadable as PDF</span>
            </div>
          </div>
        </div>

      </div>

      {/* Full Description & Curriculum Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Course Syllabus / Curriculum (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2">About This Course</h2>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {course.description}
            </div>
          </div>

          {/* Curriculum Accordion */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Course Curriculum</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {course.module_count} Modules • {course.lesson_count} Lessons
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {course.modules && course.modules.length > 0 ? (
                course.modules.map((mod, index) => {
                  const isOpen = !!openModules[index];
                  return (
                    <div key={mod.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      {/* Module Header Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleModule(index)}
                        className="w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100/80 text-left flex items-center justify-between transition"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <div>
                            <h3 className="text-sm font-bold text-slate-800">{mod.title}</h3>
                            {mod.description && (
                              <p className="text-xs text-slate-500">{mod.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-slate-500">
                          <span>{mod.lessons?.length || 0} lessons</span>
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {/* Module Lessons List */}
                      {isOpen && (
                        <div className="divide-y divide-slate-100 bg-white">
                          {mod.lessons && mod.lessons.length > 0 ? (
                            mod.lessons.map((les) => (
                              <div
                                key={les.id}
                                className="px-5 py-3 flex items-center justify-between text-xs hover:bg-slate-50/50"
                              >
                                <div className="flex items-center space-x-3 text-slate-700">
                                  <PlayCircle className="w-4 h-4 text-brand-600 shrink-0" />
                                  <span className="font-medium">{les.title}</span>
                                </div>
                                <span className="text-slate-400 font-mono">{les.duration || '15 mins'}</span>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-xs text-slate-400 text-center">
                              No lessons published in this module yet.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500">No modules available yet.</p>
              )}

              {/* Final Assessment Notice */}
              {course.quiz && (
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <h4 className="font-bold">Final Assessment: {course.quiz.title}</h4>
                      <p className="text-amber-700">Passing score required: {course.quiz.passing_score}%</p>
                    </div>
                  </div>
                  <span className="font-semibold bg-amber-200/80 px-2.5 py-1 rounded">
                    Required for Certificate
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Certificate Requirements</h3>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                <span>Complete 100% of all curriculum video lessons & readings.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                <span>Score at least {course.quiz?.passing_score || 60}% on the final examination.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                <span>Instant verification code generation stored in MySQL database.</span>
              </li>
            </ul>

            <div className="pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified by CertifyHub Academic Standards</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CourseDetails;
