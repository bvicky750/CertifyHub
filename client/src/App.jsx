import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Quiz from './pages/Quiz';
import VerifyCertificate from './pages/VerifyCertificate';
import AdminDashboard from './pages/admin/AdminDashboard';

const App = () => {
  const location = useLocation();

  // Classroom is a dedicated full-screen distraction-free layout
  const isClassroom = location.pathname.startsWith('/learn/');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      {!isClassroom && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/verify" element={<VerifyCertificate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/:courseId"
            element={
              <ProtectedRoute>
                <Learn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:quizId"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                <h1 className="text-6xl font-black text-slate-800">404</h1>
                <p className="text-sm text-slate-500 mt-2 mb-6">The page you requested could not be found.</p>
                <a
                  href="/"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow transition"
                >
                  Return to Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>

      {!isClassroom && <Footer />}
    </div>
  );
};

export default App;
