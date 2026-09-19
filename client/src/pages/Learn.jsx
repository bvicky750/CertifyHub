import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Award,
  BookOpen,
  ArrowLeft,
  Check
} from 'lucide-react';

const Learn = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  // Fetch course curriculum & progress
  const fetchCurriculum = async () => {
    try {
      const res = await API.get(`/lessons/curriculum/${courseId}`);
      if (res.data.success) {
        setCourseData(res.data);

        // Flatten lessons to pick current or active
        const allLessons = [];
        res.data.modules.forEach((mod) => {
          (mod.lessons || []).forEach((l) => allLessons.push(l));
        });

        // If no active lesson selected yet, pick first uncompleted or first lesson
        if (!activeLesson && allLessons.length > 0) {
          const firstUncompleted = allLessons.find((l) => !l.is_completed);
          setActiveLesson(firstUncompleted || allLessons[0]);
        } else if (activeLesson) {
          // Refresh active lesson data
          const updated = allLessons.find((l) => l.id === activeLesson.id);
          if (updated) setActiveLesson(updated);
        }
      }
    } catch (err) {
      console.error('Failed to load learning curriculum:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, [courseId]);

  const handleToggleComplete = async () => {
    if (!activeLesson || toggling) return;

    try {
      setToggling(true);
      const newStatus = !activeLesson.is_completed;
      const res = await API.post('/lessons/progress', {
        lessonId: activeLesson.id,
        courseId: parseInt(courseId, 10),
        completed: newStatus
      });

      if (res.data.success) {
        // Update local state
        await fetchCurriculum();
      }
    } catch (err) {
      console.error('Failed to toggle lesson progress:', err);
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading interactive classroom..." />;
  }

  if (!courseData) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">Classroom Unavailable</h2>
        <p className="text-sm text-slate-500 mt-2">You might not be enrolled in this course yet.</p>
        <Link to={`/courses/${courseId}`} className="mt-4 inline-block px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-lg">
          Back to Course Page
        </Link>
      </div>
    );
  }

  // Flatten lessons for Next / Prev navigation
  const allLessons = [];
  courseData.modules.forEach((mod) => {
    (mod.lessons || []).forEach((l) => allLessons.push(l));
  });

  const currentIndex = allLessons.findIndex((l) => l?.id === activeLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const allDone = courseData.progress === 100;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      
      {/* Top Learning Bar */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center space-x-3 truncate">
          <Link
            to="/dashboard"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Return to Student Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="truncate">
            <h1 className="text-sm font-bold text-white truncate max-w-sm sm:max-w-md">
              {activeLesson?.title || 'Interactive Lesson'}
            </h1>
            <span className="text-[11px] text-slate-400">
              Module: {courseData.modules.find((m) => m.lessons.some((l) => l.id === activeLesson?.id))?.title || 'Coursework'}
            </span>
          </div>
        </div>

        {/* Progress Display */}
        <div className="flex items-center space-x-4 shrink-0">
          <div className="hidden sm:block w-36">
            <ProgressBar progress={courseData.progress} size="sm" showLabel={true} color="emerald" />
          </div>
          {courseData.quiz && (
            <Link
              to={`/quiz/${courseData.quiz.id}`}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                allDone
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 animate-bounce'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Final Quiz</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Split Interface */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT: Curriculum Sidebar (Desktop & Drawer) */}
        <aside className="w-full lg:w-80 xl:w-96 bg-slate-950/60 border-r border-slate-800 flex flex-col shrink-0 order-2 lg:order-1 max-h-[35vh] lg:max-h-none overflow-y-auto">
          <div className="p-4 border-b border-slate-800/80 sticky top-0 bg-slate-950 z-10 flex justify-between items-center">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Course Syllabus</h2>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                {courseData.completed_lessons} of {courseData.total_lessons} completed ({courseData.progress}%)
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-800/60 flex-1">
            {courseData.modules.map((mod, modIdx) => (
              <div key={mod.id} className="py-2">
                <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]">
                    {modIdx + 1}
                  </span>
                  <span className="truncate">{mod.title}</span>
                </div>

                <div className="space-y-0.5 mt-1">
                  {mod.lessons?.map((les) => {
                    const isActive = activeLesson?.id === les.id;
                    return (
                      <button
                        key={les.id}
                        type="button"
                        onClick={() => setActiveLesson(les)}
                        className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition ${
                          isActive
                            ? 'bg-brand-600/20 text-brand-300 border-l-4 border-brand-500 font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          {les.is_completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : isActive ? (
                            <PlayCircle className="w-4 h-4 text-brand-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                          )}
                          <span className="truncate">{les.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0 pl-2">
                          {les.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Final Quiz Item */}
            {courseData.quiz && (
              <div className="p-4 bg-amber-950/20">
                <Link
                  to={`/quiz/${courseData.quiz.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition text-xs font-semibold"
                >
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Take Final Certification Quiz</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT: Main Lesson Viewer */}
        <main className="flex-1 flex flex-col bg-slate-900 order-1 lg:order-2 overflow-y-auto">
          {activeLesson ? (
            <div className="p-4 sm:p-8 max-w-4xl mx-auto w-full space-y-6 flex-1 flex flex-col">
              
              {/* Video Embed Player */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl relative">
                {activeLesson.video_url ? (
                  <iframe
                    src={activeLesson.video_url}
                    title={activeLesson.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                    <PlayCircle className="w-16 h-16 text-slate-700" />
                    <p className="text-sm">Interactive reading and guided practice module.</p>
                  </div>
                )}
              </div>

              {/* Lesson Control & Completion Bar */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {activeLesson.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Estimated Time: {activeLesson.duration}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleComplete}
                  disabled={toggling}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition shadow-md ${
                    activeLesson.is_completed
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  }`}
                >
                  {activeLesson.is_completed ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>✓ Completed</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark as Complete</span>
                    </>
                  )}
                </button>
              </div>

              {/* Lesson Description & Reading Notes */}
              <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-brand-400" />
                  <span>Lesson Notes & Guided Syllabus</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeLesson.description || 'Follow along with the lecture material above, practice hands-on coding, and consult external references.'}
                </p>

                {/* Resource Attachment */}
                {activeLesson.resource_url && (
                  <div className="pt-2">
                    <a
                      href={activeLesson.resource_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-400 hover:text-brand-300 bg-slate-900 px-3.5 py-2 rounded-lg border border-slate-800 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Official Documentation Reference</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Navigation Controls (Prev / Next) */}
              <div className="mt-auto pt-6 border-t border-slate-800 flex justify-between items-center text-xs">
                {prevLesson ? (
                  <button
                    type="button"
                    onClick={() => setActiveLesson(prevLesson)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous: {prevLesson.title}</span>
                  </button>
                ) : <div />}

                {nextLesson ? (
                  <button
                    type="button"
                    onClick={() => setActiveLesson(nextLesson)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-500 transition font-semibold"
                  >
                    <span>Next: {nextLesson.title}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : courseData.quiz ? (
                  <Link
                    to={`/quiz/${courseData.quiz.id}`}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20"
                  >
                    <span>Ready for Final Assessment!</span>
                    <Award className="w-4 h-4" />
                  </Link>
                ) : null}
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-slate-500 text-sm">
              Select a lesson from the curriculum to begin learning.
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default Learn;
