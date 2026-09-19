import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  FileQuestion,
  Users,
  Award,
  ListOrdered,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Data states
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // Course Modal State
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    short_description: '',
    description: '',
    instructor_name: '',
    category: 'Web Development',
    level: 'Beginner',
    duration: '8 Weeks',
    thumbnail: '',
    status: 'published'
  });

  // Module & Lesson Modal State
  const [selectedCourseForCurriculum, setSelectedCourseForCurriculum] = useState(null);
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [moduleForm, setModuleForm] = useState({ title: '', description: '', orderNumber: 1 });
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    moduleId: null,
    title: '',
    description: '',
    videoUrl: '',
    resourceUrl: '',
    duration: '20 mins',
    orderNumber: 1
  });

  // Quiz Modal State
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 'A',
    marks: 10
  });

  // Load all initial admin data
  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, coursesRes, studentsRes, enrollRes, certRes] = await Promise.allSettled([
        API.get('/admin/stats'),
        API.get('/courses?status='), // Fetch all courses including drafts
        API.get('/admin/students'),
        API.get('/admin/enrollments'),
        API.get('/admin/certificates')
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.stats);
      if (coursesRes.status === 'fulfilled') {
        const fetchedCourses = coursesRes.value.data.courses || [];
        setCourses(fetchedCourses);
        if (!selectedCourseForCurriculum && fetchedCourses.length > 0) {
          loadCourseCurriculum(fetchedCourses[0].id);
        }
      }
      if (studentsRes.status === 'fulfilled') setStudents(studentsRes.value.data.students || []);
      if (enrollRes.status === 'fulfilled') setEnrollments(enrollRes.value.data.enrollments || []);
      if (certRes.status === 'fulfilled') setCertificates(certRes.value.data.certificates || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const showNotification = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  // 1. Course Management Handlers
  const handleOpenCourseModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        title: course.title,
        short_description: course.short_description || '',
        description: course.description,
        instructor_name: course.instructor_name,
        category: course.category,
        level: course.level,
        duration: course.duration,
        thumbnail: course.thumbnail || '',
        status: course.status
      });
    } else {
      setEditingCourse(null);
      setCourseForm({
        title: '',
        short_description: '',
        description: '',
        instructor_name: 'Dr. Angela Vance',
        category: 'Web Development',
        level: 'Beginner',
        duration: '8 Weeks',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        status: 'published'
      });
    }
    setCourseModalOpen(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      if (editingCourse) {
        await API.put(`/courses/${editingCourse.id}`, courseForm);
        showNotification('success', 'Course updated successfully.');
      } else {
        await API.post('/courses', courseForm);
        showNotification('success', 'Course created successfully.');
      }
      setCourseModalOpen(false);
      await loadAdminData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Error saving course.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course and all associated lessons, quizzes, and enrollments?')) {
      return;
    }

    try {
      setActionLoading(true);
      await API.delete(`/courses/${courseId}`);
      showNotification('success', 'Course deleted successfully.');
      await loadAdminData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Error deleting course.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (course) => {
    const newStatus = course.status === 'published' ? 'draft' : 'published';
    try {
      await API.put(`/courses/${course.id}`, { status: newStatus });
      showNotification('success', `Course status changed to ${newStatus}.`);
      await loadAdminData();
    } catch (err) {
      showNotification('error', 'Failed to toggle status.');
    }
  };

  // 2. Curriculum & Module Handlers
  const loadCourseCurriculum = async (courseId) => {
    try {
      const res = await API.get(`/courses/${courseId}`);
      if (res.data.success) {
        setSelectedCourseForCurriculum(res.data.course);
        if (res.data.course.quiz) {
          loadQuizDetails(res.data.course.quiz.id);
        } else {
          setSelectedQuiz(null);
        }
      }
    } catch (err) {
      console.error('Error loading curriculum:', err);
    }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await API.post('/lessons/modules', {
        courseId: selectedCourseForCurriculum.id,
        ...moduleForm
      });
      showNotification('success', 'Module added.');
      setModuleModalOpen(false);
      setModuleForm({ title: '', description: '', orderNumber: 1 });
      await loadCourseCurriculum(selectedCourseForCurriculum.id);
    } catch (err) {
      showNotification('error', 'Failed to add module.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Delete this module and all its lessons?')) return;
    try {
      await API.delete(`/lessons/modules/${moduleId}`);
      showNotification('success', 'Module deleted.');
      await loadCourseCurriculum(selectedCourseForCurriculum.id);
    } catch (err) {
      showNotification('error', 'Failed to delete module.');
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await API.post('/lessons/lessons', lessonForm);
      showNotification('success', 'Lesson added.');
      setLessonModalOpen(false);
      setLessonForm({
        moduleId: null,
        title: '',
        description: '',
        videoUrl: '',
        resourceUrl: '',
        duration: '20 mins',
        orderNumber: 1
      });
      await loadCourseCurriculum(selectedCourseForCurriculum.id);
    } catch (err) {
      showNotification('error', 'Failed to add lesson.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await API.delete(`/lessons/lessons/${lessonId}`);
      showNotification('success', 'Lesson deleted.');
      await loadCourseCurriculum(selectedCourseForCurriculum.id);
    } catch (err) {
      showNotification('error', 'Failed to delete lesson.');
    }
  };

  // 3. Quiz Handlers
  const loadQuizDetails = async (quizId) => {
    try {
      const res = await API.get(`/quizzes/${quizId}`);
      if (res.data.success) {
        setSelectedQuiz(res.data.quiz);
      }
    } catch (err) {
      console.error('Failed to load quiz details:', err);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await API.post(`/quizzes/${selectedQuiz.id}/questions`, questionForm);
      showNotification('success', 'Question added to quiz.');
      setQuestionModalOpen(false);
      setQuestionForm({
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOption: 'A',
        marks: 10
      });
      await loadQuizDetails(selectedQuiz.id);
    } catch (err) {
      showNotification('error', 'Failed to add question.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await API.delete(`/quizzes/questions/${questionId}`);
      showNotification('success', 'Question deleted.');
      await loadQuizDetails(selectedQuiz.id);
    } catch (err) {
      showNotification('error', 'Failed to delete question.');
    }
  };

  if (loading && !stats) {
    return <LoadingSpinner text="Loading Administrative Control Center..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>CertifyHub Faculty & Administrator Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Academic Administration</h1>
          <p className="text-xs text-slate-400">
            Manage courses, curriculum, quizzes, student registrations, and issued credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenCourseModal()}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Notification toast */}
      {feedback.message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback({ type: '', message: '' })} className="underline ml-4">Dismiss</button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview & Stats', icon: LayoutDashboard },
          { id: 'courses', label: `Courses (${courses.length})`, icon: BookOpen },
          { id: 'curriculum', label: 'Curriculum & Lessons', icon: FolderTree },
          { id: 'quizzes', label: 'Quizzes & Questions', icon: FileQuestion },
          { id: 'students', label: `Students (${students.length})`, icon: Users },
          { id: 'enrollments', label: `Enrollments (${enrollments.length})`, icon: ListOrdered },
          { id: 'certificates', label: `Certificates (${certificates.length})`, icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-[10px] uppercase font-semibold text-slate-400">Total Students</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.totalStudents || 0}</h3>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-[10px] uppercase font-semibold text-slate-400">Total Courses</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.totalCourses || 0}</h3>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-[10px] uppercase font-semibold text-slate-400">Published</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{stats?.publishedCourses || 0}</h3>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-[10px] uppercase font-semibold text-slate-400">Enrollments</p>
              <h3 className="text-2xl font-black text-brand-600 mt-1">{stats?.totalEnrollments || 0}</h3>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-[10px] uppercase font-semibold text-slate-400">Completions</p>
              <h3 className="text-2xl font-black text-purple-600 mt-1">{stats?.completedCourses || 0}</h3>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-[10px] uppercase font-semibold text-slate-400">Certificates</p>
              <h3 className="text-2xl font-black text-amber-500 mt-1">{stats?.certificatesIssued || 0}</h3>
            </div>
          </div>

          {/* Recent Tables Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Enrollments */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Recent Enrollments</h3>
              <div className="divide-y divide-slate-100 text-xs">
                {stats?.recentEnrollments?.map((en) => (
                  <div key={en.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{en.student_name}</p>
                      <p className="text-[11px] text-slate-500">{en.course_title}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        en.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-brand-50 text-brand-700'
                      }`}>
                        {en.status}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{new Date(en.enrolled_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Certificates */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Recent Issued Certificates</h3>
              <div className="divide-y divide-slate-100 text-xs">
                {stats?.recentCertificates?.map((cert) => (
                  <div key={cert.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{cert.student_name}</p>
                      <p className="text-[11px] text-slate-500">{cert.course_title}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {cert.certificate_number}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{new Date(cert.issue_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: COURSE MANAGEMENT */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">All Courses</h2>
              <p className="text-xs text-slate-500">Create, modify, publish, or delete catalog courses.</p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenCourseModal()}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-brand-600 hover:bg-brand-700"
            >
              <Plus className="w-4 h-4" />
              <span>New Course</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Course</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Instructor</th>
                  <th className="px-4 py-3.5">Level</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Modules / Lessons</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-900 max-w-xs">
                      {c.title}
                    </td>
                    <td className="px-4 py-4">{c.category}</td>
                    <td className="px-4 py-4">{c.instructor_name}</td>
                    <td className="px-4 py-4">{c.level}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(c)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                          c.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {c.status}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      {c.module_count || 0} Modules • {c.lesson_count || 0} Lessons
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCourseForCurriculum(c);
                          loadCourseCurriculum(c.id);
                          setActiveTab('curriculum');
                        }}
                        className="p-1.5 text-slate-500 hover:text-brand-600 rounded"
                        title="Edit Curriculum"
                      >
                        <FolderTree className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenCourseModal(c)}
                        className="p-1.5 text-slate-500 hover:text-brand-600 rounded"
                        title="Edit Course Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCourse(c.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 rounded"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CURRICULUM (MODULES & LESSONS) */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Curriculum Editor</h2>
              <p className="text-xs text-slate-500">Manage hierarchical modules and video/text lessons.</p>
            </div>

            {/* Course Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-600">Select Course:</span>
              <select
                value={selectedCourseForCurriculum?.id || ''}
                onChange={(e) => loadCourseCurriculum(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setModuleModalOpen(true)}
                className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Module</span>
              </button>
            </div>
          </div>

          {selectedCourseForCurriculum ? (
            <div className="space-y-4">
              {selectedCourseForCurriculum.modules?.map((mod, modIdx) => (
                <div key={mod.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-50 border-b border-slate-200/70 flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-2 font-bold text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px]">
                        {modIdx + 1}
                      </span>
                      <span>{mod.title}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLessonForm((prev) => ({ ...prev, moduleId: mod.id }));
                          setLessonModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Lesson</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteModule(mod.id)}
                        className="p-1 text-slate-400 hover:text-red-600"
                        title="Delete Module"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    {mod.lessons?.map((les, lesIdx) => (
                      <div key={les.id} className="px-5 py-3 flex justify-between items-center hover:bg-slate-50/50">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-800">
                            {lesIdx + 1}. {les.title}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            Duration: {les.duration} {les.video_url && '• Video Attached'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteLesson(les.id)}
                          className="p-1 text-slate-400 hover:text-red-600"
                          title="Delete Lesson"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {(!mod.lessons || mod.lessons.length === 0) && (
                      <p className="p-4 text-xs text-slate-400 text-center">No lessons in this module yet.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs text-slate-400 py-8">Select a course to view and edit its modules.</p>
          )}
        </div>
      )}

      {/* TAB 4: QUIZZES */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Quiz Assessment Manager</h2>
              <p className="text-xs text-slate-500">Configure questions, answer options, and passing scores.</p>
            </div>

            {selectedQuiz && (
              <button
                type="button"
                onClick={() => setQuestionModalOpen(true)}
                className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            )}
          </div>

          {selectedQuiz ? (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm">{selectedQuiz.title}</h3>
                  <p className="text-amber-800">Course: {selectedCourseForCurriculum?.title} • Passing Score: {selectedQuiz.passing_score}%</p>
                </div>
                <span className="font-mono text-xs font-bold">{selectedQuiz.questions?.length || 0} Questions</span>
              </div>

              <div className="space-y-3">
                {selectedQuiz.questions?.map((q, idx) => (
                  <div key={q.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs text-xs space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900">
                        {idx + 1}. {q.question}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1 text-slate-400 hover:text-red-600"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className={`p-2 rounded border ${q.correct_option === 'A' ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                        A. {q.option_a}
                      </div>
                      <div className={`p-2 rounded border ${q.correct_option === 'B' ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                        B. {q.option_b}
                      </div>
                      <div className={`p-2 rounded border ${q.correct_option === 'C' ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                        C. {q.option_c}
                      </div>
                      <div className={`p-2 rounded border ${q.correct_option === 'D' ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                        D. {q.option_d}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-xs text-slate-400 py-8">
              Select a course with a quiz from the Curriculum tab to manage its questions.
            </p>
          )}
        </div>
      )}

      {/* TAB 5: STUDENTS */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Registered Students</h2>
            <p className="text-xs text-slate-500">View registered students, enrolled courses, and completion status.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Enrolled</th>
                  <th className="px-4 py-3.5">Completed</th>
                  <th className="px-4 py-3.5">Certificates</th>
                  <th className="px-6 py-3.5">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                        {st.name.charAt(0)}
                      </div>
                      <span>{st.name}</span>
                    </td>
                    <td className="px-4 py-4 text-slate-500 font-mono">{st.email}</td>
                    <td className="px-4 py-4 font-bold text-brand-600">{st.enrolled_count || 0}</td>
                    <td className="px-4 py-4 font-bold text-emerald-600">{st.completed_count || 0}</td>
                    <td className="px-4 py-4 font-bold text-amber-600">{st.certificates_count || 0}</td>
                    <td className="px-6 py-4 text-slate-400">{new Date(st.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: ENROLLMENTS */}
      {activeTab === 'enrollments' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Master Enrollment Ledger</h2>
            <p className="text-xs text-slate-500">Live record of all course enrollments across the portal.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-4 py-3.5">Course</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Enrolled Date</th>
                  <th className="px-6 py-3.5">Completed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {enrollments.map((en) => (
                  <tr key={en.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-900">{en.student_name}</td>
                    <td className="px-4 py-4">{en.course_title}</td>
                    <td className="px-4 py-4">{en.category}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        en.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-brand-50 text-brand-700'
                      }`}>
                        {en.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-400">{new Date(en.enrolled_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {en.completed_at ? new Date(en.completed_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Issued Certificates Registry</h2>
            <p className="text-xs text-slate-500">Official tamper-proof database of all academic credentials awarded.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Certificate ID</th>
                  <th className="px-4 py-3.5">Student</th>
                  <th className="px-4 py-3.5">Course</th>
                  <th className="px-4 py-3.5">Verification Code</th>
                  <th className="px-4 py-3.5">Issue Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono font-bold text-amber-700">{cert.certificate_number}</td>
                    <td className="px-4 py-4 font-bold text-slate-900">{cert.student_name}</td>
                    <td className="px-4 py-4">{cert.course_title}</td>
                    <td className="px-4 py-4 font-mono text-slate-500">{cert.verification_code}</td>
                    <td className="px-4 py-4 text-slate-400">{new Date(cert.issue_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`/verify?id=${encodeURIComponent(cert.certificate_number)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                      >
                        <span>Verify Publicly</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT COURSE MODAL */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <h3 className="text-xl font-bold text-slate-900">
              {editingCourse ? 'Edit Course Details' : 'Create New Course'}
            </h3>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Full Stack Web Development"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Programming">Programming</option>
                    <option value="Database">Database</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cloud">Cloud</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Level</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Instructor Name</label>
                  <input
                    type="text"
                    required
                    value={courseForm.instructor_name}
                    onChange={(e) => setCourseForm({ ...courseForm, instructor_name: e.target.value })}
                    placeholder="e.g. Dr. Angela Vance"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    placeholder="e.g. 10 Weeks"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  value={courseForm.short_description}
                  onChange={(e) => setCourseForm({ ...courseForm, short_description: e.target.value })}
                  placeholder="One sentence summary..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Curriculum Description</label>
                <textarea
                  rows={3}
                  required
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Detailed course overview..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thumbnail URL</label>
                  <input
                    type="text"
                    value={courseForm.thumbnail}
                    onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={courseForm.status}
                    onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MODULE MODAL */}
      {moduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New Module</h3>
            <form onSubmit={handleAddModule} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Module Title</label>
                <input
                  type="text"
                  required
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  placeholder="e.g. Advanced Routing & Middleware"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  placeholder="Brief synopsis..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Order Sequence</label>
                <input
                  type="number"
                  value={moduleForm.orderNumber}
                  onChange={(e) => setModuleForm({ ...moduleForm, orderNumber: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModuleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold"
                >
                  Create Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD LESSON MODAL */}
      {lessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Lesson to Module</h3>
            <form onSubmit={handleAddLesson} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="e.g. Asynchronous Request Handlers"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Video Embed URL (YouTube/Vimeo)</label>
                <input
                  type="text"
                  value={lessonForm.videoUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reading Resource URL</label>
                <input
                  type="text"
                  value={lessonForm.resourceUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, resourceUrl: e.target.value })}
                  placeholder="https://developer.mozilla.org/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={lessonForm.orderNumber}
                    onChange={(e) => setLessonForm({ ...lessonForm, orderNumber: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lesson Content / Notes</label>
                <textarea
                  rows={3}
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setLessonModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold"
                >
                  Save Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD QUESTION MODAL */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <h3 className="text-lg font-bold text-slate-900">Add Question to Quiz</h3>
            <form onSubmit={handleAddQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question Prompt</label>
                <textarea
                  rows={2}
                  required
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                  placeholder="e.g. Which keyword declares an asynchronous function in ES6?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Option A</label>
                <input
                  type="text"
                  required
                  value={questionForm.optionA}
                  onChange={(e) => setQuestionForm({ ...questionForm, optionA: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Option B</label>
                <input
                  type="text"
                  required
                  value={questionForm.optionB}
                  onChange={(e) => setQuestionForm({ ...questionForm, optionB: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Option C</label>
                <input
                  type="text"
                  required
                  value={questionForm.optionC}
                  onChange={(e) => setQuestionForm({ ...questionForm, optionC: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Option D</label>
                <input
                  type="text"
                  required
                  value={questionForm.optionD}
                  onChange={(e) => setQuestionForm({ ...questionForm, optionD: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Correct Answer</label>
                  <select
                    value={questionForm.correctOption}
                    onChange={(e) => setQuestionForm({ ...questionForm, correctOption: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Marks</label>
                  <input
                    type="number"
                    value={questionForm.marks}
                    onChange={(e) => setQuestionForm({ ...questionForm, marks: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setQuestionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
