const { query } = require('../config/db');

// @desc    Get quiz and questions (without correct_option for students)
// @route   GET /api/quizzes/:id
// @access  Private
const getQuizById = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Fetch quiz with course details
    const quizzes = await query(
      `SELECT q.*, c.title AS course_title, c.slug AS course_slug 
       FROM quizzes q
       JOIN courses c ON q.course_id = c.id
       WHERE q.id = ?`,
      [quizId]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    const quiz = quizzes[0];

    // Fetch questions
    let questions;
    if (isAdmin) {
      // Admin sees correct_option
      questions = await query(
        'SELECT * FROM questions WHERE quiz_id = ? ORDER BY id ASC',
        [quizId]
      );
    } else {
      // Student does NOT receive correct_option
      questions = await query(
        'SELECT id, quiz_id, question, option_a, option_b, option_c, option_d, marks FROM questions WHERE quiz_id = ? ORDER BY id ASC',
        [quizId]
      );
    }

    // Check previous attempts by this student
    const attempts = await query(
      'SELECT * FROM quiz_attempts WHERE quiz_id = ? AND user_id = ? ORDER BY attempted_at DESC',
      [quizId, userId]
    );

    return res.json({
      success: true,
      quiz: {
        ...quiz,
        questions
      },
      latest_attempt: attempts.length > 0 ? attempts[0] : null,
      attempt_count: attempts.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz answers and evaluate on the backend
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const userId = req.user.id;
    const { answers } = req.body; // { questionId: 'A' | 'B' | 'C' | 'D' }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ success: false, message: 'Answers object is required.' });
    }

    // Get quiz
    const quizzes = await query('SELECT * FROM quizzes WHERE id = ?', [quizId]);
    if (quizzes.length === 0) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }
    const quiz = quizzes[0];

    // Fetch authoritative questions with correct options
    const questions = await query('SELECT * FROM questions WHERE quiz_id = ?', [quizId]);
    if (questions.length === 0) {
      return res.status(400).json({ success: false, message: 'This quiz has no questions configured.' });
    }

    let score = 0;
    let totalMarks = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    const feedback = questions.map((q) => {
      const studentAnswer = (answers[q.id] || '').toUpperCase();
      const isCorrect = studentAnswer === q.correct_option;
      totalMarks += q.marks;

      if (isCorrect) {
        score += q.marks;
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }

      return {
        questionId: q.id,
        question: q.question,
        studentAnswer,
        correctOption: q.correct_option,
        isCorrect,
        marksAwarded: isCorrect ? q.marks : 0,
        maxMarks: q.marks
      };
    });

    const percentage = totalMarks > 0 ? Number(((score / totalMarks) * 100).toFixed(2)) : 0;
    const passed = percentage >= quiz.passing_score;

    // Save attempt in database
    await query(
      `INSERT INTO quiz_attempts 
        (quiz_id, user_id, score, total_marks, percentage, passed) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [quizId, userId, score, totalMarks, percentage, passed ? 1 : 0]
    );

    // Check course completion status
    let courseCompleted = false;
    if (passed) {
      // Check if all lessons are completed
      const [totalLessonsRes] = await query(
        `SELECT COUNT(l.id) AS total_lessons
         FROM lessons l
         JOIN modules m ON l.module_id = m.id
         WHERE m.course_id = ?`,
        [quiz.course_id]
      );
      const totalLessons = totalLessonsRes ? totalLessonsRes.total_lessons : 0;

      // Find user enrollment
      const enrollments = await query(
        'SELECT id, status FROM enrollments WHERE user_id = ? AND course_id = ?',
        [userId, quiz.course_id]
      );

      if (enrollments.length > 0) {
        const enrollment = enrollments[0];
        const [compLessonsRes] = await query(
          'SELECT COUNT(id) AS completed_lessons FROM lesson_progress WHERE enrollment_id = ? AND completed = 1',
          [enrollment.id]
        );
        const completedLessons = compLessonsRes ? compLessonsRes.completed_lessons : 0;

        if (completedLessons >= totalLessons && totalLessons > 0) {
          // Both conditions met!
          await query(
            'UPDATE enrollments SET status = "completed", completed_at = COALESCE(completed_at, CURRENT_TIMESTAMP) WHERE id = ?',
            [enrollment.id]
          );
          courseCompleted = true;
        }
      }
    }

    return res.json({
      success: true,
      message: passed
        ? 'Congratulations! You passed the quiz!'
        : 'Quiz submitted. Unfortunately, you did not meet the passing criteria.',
      results: {
        score,
        totalMarks,
        percentage,
        passed,
        passingScore: quiz.passing_score,
        correctCount,
        incorrectCount,
        courseCompleted,
        feedback
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create / update quiz
const createQuiz = async (req, res, next) => {
  try {
    const { courseId, title, description, passingScore } = req.body;
    if (!courseId || !title) {
      return res.status(400).json({ success: false, message: 'courseId and title are required.' });
    }

    const result = await query(
      'INSERT INTO quizzes (course_id, title, description, passing_score) VALUES (?, ?, ?, ?)',
      [courseId, title.trim(), description || '', passingScore || 60]
    );

    const newQuiz = await query('SELECT * FROM quizzes WHERE id = ?', [result.insertId]);
    return res.status(201).json({ success: true, quiz: newQuiz[0] });
  } catch (error) {
    next(error);
  }
};

const updateQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const { title, description, passingScore } = req.body;

    await query(
      'UPDATE quizzes SET title = COALESCE(?, title), description = COALESCE(?, description), passing_score = COALESCE(?, passing_score) WHERE id = ?',
      [title, description, passingScore, quizId]
    );

    const updated = await query('SELECT * FROM quizzes WHERE id = ?', [quizId]);
    return res.json({ success: true, quiz: updated[0] });
  } catch (error) {
    next(error);
  }
};

// Admin: Question management
const addQuestion = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const { question, optionA, optionB, optionC, optionD, correctOption, marks } = req.body;

    if (!question || !optionA || !optionB || !optionC || !optionD || !correctOption) {
      return res.status(400).json({ success: false, message: 'All question fields and options are required.' });
    }

    const result = await query(
      `INSERT INTO questions 
        (quiz_id, question, option_a, option_b, option_c, option_d, correct_option, marks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [quizId, question.trim(), optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim(), correctOption.toUpperCase(), marks || 10]
    );

    const newQuestion = await query('SELECT * FROM questions WHERE id = ?', [result.insertId]);
    return res.status(201).json({ success: true, question: newQuestion[0] });
  } catch (error) {
    next(error);
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    const questionId = req.params.id;
    const { question, optionA, optionB, optionC, optionD, correctOption, marks } = req.body;

    await query(
      `UPDATE questions 
       SET question = COALESCE(?, question),
           option_a = COALESCE(?, option_a),
           option_b = COALESCE(?, option_b),
           option_c = COALESCE(?, option_c),
           option_d = COALESCE(?, option_d),
           correct_option = COALESCE(?, correct_option),
           marks = COALESCE(?, marks)
       WHERE id = ?`,
      [question, optionA, optionB, optionC, optionD, correctOption, marks, questionId]
    );

    const updated = await query('SELECT * FROM questions WHERE id = ?', [questionId]);
    return res.json({ success: true, question: updated[0] });
  } catch (error) {
    next(error);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    const questionId = req.params.id;
    await query('DELETE FROM questions WHERE id = ?', [questionId]);
    return res.json({ success: true, message: 'Question deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuizById,
  submitQuiz,
  createQuiz,
  updateQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion
};
