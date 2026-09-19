import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import CertificateModal from '../components/CertificateModal';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

const Quiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [generatedCert, setGeneratedCert] = useState(null);
  const [generatingCert, setGeneratingCert] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/quizzes/${quizId}`);
      if (res.data.success) {
        setQuizData(res.data.quiz);
      }
    } catch (err) {
      console.error('Failed to load quiz:', err);
      setErrorMsg('Failed to load assessment questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const handleSelectOption = (questionId, optionLetter) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionLetter
    }));
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();

    // Verify all answered
    const unanswered = quizData.questions.filter((q) => !selectedAnswers[q.id]);
    if (unanswered.length > 0) {
      if (!window.confirm(`You have left ${unanswered.length} question(s) unanswered. Submit anyway?`)) {
        return;
      }
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      const res = await API.post(`/quizzes/${quizId}/submit`, {
        answers: selectedAnswers
      });

      if (res.data.success) {
        setResults(res.data.results);

        // If passed, shoot confetti celebration!
        if (res.data.results.passed) {
          try {
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {}
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error evaluating quiz submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClaimCertificate = async () => {
    try {
      setGeneratingCert(true);
      setErrorMsg('');
      const res = await API.post('/certificates/generate', {
        courseId: quizData.course_id
      });
      if (res.data.success) {
        setGeneratedCert(res.data.certificate);
        setShowCertModal(true);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Could not generate certificate. Please ensure all lessons are completed.');
    } finally {
      setGeneratingCert(false);
    }
  };

  const handleRetake = () => {
    setResults(null);
    setSelectedAnswers({});
    setErrorMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <LoadingSpinner text="Preparing certification assessment..." />;
  }

  if (!quizData) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">Quiz not found</h2>
        <p className="text-sm text-slate-500 mt-2">The requested quiz could not be located.</p>
        <Link to="/dashboard" className="mt-4 inline-block px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            to={`/learn/${quizData.course_id}`}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 hover:text-brand-700 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Course Classroom</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">
            {quizData.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Course: <span className="font-semibold text-slate-700">{quizData.course_title}</span> • Passing Threshold: <span className="font-bold text-brand-600">{quizData.passing_score}%</span>
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold shrink-0">
          <Award className="w-4 h-4 text-amber-600" />
          <span>Certification Exam</span>
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* RESULT VIEW (If Submitted) */}
      {results ? (
        <div className="space-y-6">
          
          {/* Result Banner */}
          <div
            className={`rounded-3xl p-8 sm:p-10 text-white shadow-xl text-center space-y-4 ${
              results.passed
                ? 'bg-gradient-to-br from-emerald-600 to-teal-800'
                : 'bg-gradient-to-br from-slate-800 to-slate-900'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto text-white">
              {results.passed ? (
                <CheckCircle2 className="w-10 h-10 text-emerald-200" />
              ) : (
                <XCircle className="w-10 h-10 text-red-300" />
              )}
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight">
              {results.passed ? '🎉 Congratulations! You Passed!' : 'Assessment Not Passed'}
            </h2>

            <p className="text-sm text-white/80 max-w-md mx-auto">
              {results.passed
                ? 'You have successfully satisfied the testing criteria for this course credential. You are now eligible to claim your official academic certificate!'
                : `You scored ${results.percentage}%, but a passing score of ${results.passingScore}% is required to earn your certificate. Review the feedback below and try again.`}
            </p>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto pt-4 text-slate-900">
              <div className="p-3 bg-white/95 rounded-2xl shadow-sm">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Your Score</p>
                <p className="text-xl font-black">{results.score} / {results.totalMarks}</p>
              </div>
              <div className="p-3 bg-white/95 rounded-2xl shadow-sm">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Percentage</p>
                <p className="text-xl font-black">{results.percentage}%</p>
              </div>
              <div className="p-3 bg-white/95 rounded-2xl shadow-sm">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Correct</p>
                <p className="text-xl font-black text-emerald-600">{results.correctCount}</p>
              </div>
              <div className="p-3 bg-white/95 rounded-2xl shadow-sm">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Incorrect</p>
                <p className="text-xl font-black text-red-600">{results.incorrectCount}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
              {results.passed ? (
                <button
                  type="button"
                  onClick={handleClaimCertificate}
                  disabled={generatingCert}
                  className="px-8 py-3.5 rounded-xl font-extrabold text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/25 transition disabled:opacity-50 flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{generatingCert ? 'Generating Certificate...' : 'Claim Official Certificate'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-slate-700 hover:bg-slate-600 shadow-md transition flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>
              )}

              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl font-bold text-sm text-white/90 bg-white/10 hover:bg-white/20 transition"
              >
                Go to Dashboard
              </Link>
            </div>

          </div>

          {/* Question Breakdown Feedback */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Assessment Feedback & Detailed Explanations
            </h3>

            <div className="space-y-4">
              {results.feedback?.map((item, index) => (
                <div
                  key={item.questionId}
                  className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    item.isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-red-50/50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-slate-800">
                      Question {index + 1}: {item.question}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        item.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.isCorrect ? '✓ Correct (+10)' : '✗ Incorrect (0)'}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1 pt-1">
                    <p>
                      Your selection: <span className="font-semibold text-slate-800">{item.studentAnswer || 'None'}</span>
                    </p>
                    {!item.isCorrect && (
                      <p className="text-emerald-700 font-semibold">
                        Correct Answer: Option {item.correctOption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* QUIZ TAKING FORM */
        <form onSubmit={handleSubmitQuiz} className="space-y-6">
          <div className="space-y-6">
            {quizData.questions?.map((q, qIndex) => {
              const currentChoice = selectedAnswers[q.id];

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4"
                >
                  {/* Question Title */}
                  <div className="flex items-start space-x-3">
                    <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 text-xs font-black flex items-center justify-center shrink-0">
                      {qIndex + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {q.question}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium">Marks: {q.marks || 10}</span>
                    </div>
                  </div>

                  {/* Multiple Choice Options */}
                  <div className="grid grid-cols-1 gap-2.5 pt-1">
                    {[
                      { key: 'A', text: q.option_a },
                      { key: 'B', text: q.option_b },
                      { key: 'C', text: q.option_c },
                      { key: 'D', text: q.option_d }
                    ].map((opt) => {
                      const isChecked = currentChoice === opt.key;

                      return (
                        <label
                          key={opt.key}
                          onClick={() => handleSelectOption(q.id, opt.key)}
                          className={`px-4 py-3 rounded-xl border text-xs cursor-pointer flex items-center space-x-3 transition ${
                            isChecked
                              ? 'bg-brand-50 border-brand-500 text-brand-900 font-semibold shadow-xs ring-1 ring-brand-500'
                              : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/80 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            value={opt.key}
                            checked={isChecked}
                            onChange={() => handleSelectOption(q.id, opt.key)}
                            className="text-brand-600 focus:ring-brand-500"
                          />
                          <span className="w-5 font-mono font-bold text-slate-400">{opt.key}.</span>
                          <span className="flex-1">{opt.text}</span>
                        </label>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>

          {/* Submit Action */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
            <div className="text-xs text-slate-500">
              Answered: <span className="font-bold text-slate-800">{Object.keys(selectedAnswers).length}</span> of <span className="font-bold text-slate-800">{quizData.questions?.length || 0}</span> questions
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-700 shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{submitting ? 'Grading Answers on Server...' : 'Submit Final Assessment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertModal}
        certificate={generatedCert}
        onClose={() => setShowCertModal(false)}
      />

    </div>
  );
};

export default Quiz;
