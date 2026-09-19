const express = require('express');
const router = express.Router();
const {
  getCourseCurriculum,
  updateLessonProgress,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/lessonController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Student routes
router.get('/curriculum/:courseId', authMiddleware, getCourseCurriculum);
router.post('/progress', authMiddleware, updateLessonProgress);

// Admin Module routes
router.post('/modules', authMiddleware, adminMiddleware, createModule);
router.put('/modules/:id', authMiddleware, adminMiddleware, updateModule);
router.delete('/modules/:id', authMiddleware, adminMiddleware, deleteModule);

// Admin Lesson routes
router.post('/lessons', authMiddleware, adminMiddleware, createLesson);
router.put('/lessons/:id', authMiddleware, adminMiddleware, updateLesson);
router.delete('/lessons/:id', authMiddleware, adminMiddleware, deleteLesson);

module.exports = router;
