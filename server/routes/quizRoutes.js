const express = require('express');
const router = express.Router();
const {
  getQuizById,
  submitQuiz,
  createQuiz,
  updateQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/quizController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Student access & submission
router.get('/:id', getQuizById);
router.post('/:id/submit', submitQuiz);

// Admin management
router.post('/', adminMiddleware, createQuiz);
router.put('/:id', adminMiddleware, updateQuiz);
router.post('/:id/questions', adminMiddleware, addQuestion);
router.put('/questions/:id', adminMiddleware, updateQuestion);
router.delete('/questions/:id', adminMiddleware, deleteQuestion);

module.exports = router;
