const { query } = require('../config/db');

// @desc    Get course curriculum with student completion state
// @route   GET /api/courses/:courseId/lessons
// @access  Private/Enrolled
const getCourseCurriculum = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    // Check enrollment
    const enrollments = await query(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (enrollments.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to access lessons.'
      });
    }

    const enrollmentId = enrollments.length > 0 ? enrollments[0].id : null;

    // Modules
    const modules = await query(
      'SELECT * FROM modules WHERE course_id = ? ORDER BY order_number ASC, id ASC',
      [courseId]
    );

    // Lessons
    const lessons = await query(
      `SELECT l.* FROM lessons l 
       JOIN modules m ON l.module_id = m.id 
       WHERE m.course_id = ? 
       ORDER BY l.order_number ASC, l.id ASC`,
      [courseId]
    );

    // Lesson progress for this enrollment
    let completedLessonIds = [];
    if (enrollmentId) {
      const progressRecords = await query(
        'SELECT lesson_id FROM lesson_progress WHERE enrollment_id = ? AND completed = 1',
        [enrollmentId]
      );
      completedLessonIds = progressRecords.map((r) => r.lesson_id);
    }

    // Attach completion flag to each lesson
    const modulesWithLessons = modules.map((mod) => ({
      ...mod,
      lessons: lessons
        .filter((les) => les.module_id === mod.id)
        .map((les) => ({
          ...les,
          is_completed: completedLessonIds.includes(les.id)
        }))
    }));

    // Calculate progress
    const totalLessons = lessons.length;
    const completedCount = completedLessonIds.length;
    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // Quiz details
    const quizzes = await query('SELECT * FROM quizzes WHERE course_id = ?', [courseId]);

    return res.json({
      success: true,
      total_lessons: totalLessons,
      completed_lessons: completedCount,
      progress,
      modules: modulesWithLessons,
      quiz: quizzes.length > 0 ? quizzes[0] : null,
      enrollment: enrollments.length > 0 ? enrollments[0] : null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle or mark a lesson as completed
// @route   POST /api/lessons/progress
// @access  Private
const updateLessonProgress = async (req, res, next) => {
  try {
    const { lessonId, courseId, completed = true } = req.body;
    const userId = req.user.id;

    if (!lessonId || !courseId) {
      return res.status(400).json({ success: false, message: 'lessonId and courseId are required.' });
    }

    // Find enrollment
    const enrollments = await query(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (enrollments.length === 0) {
      return res.status(400).json({ success: false, message: 'You are not enrolled in this course.' });
    }

    const enrollment = enrollments[0];

    // Check if progress record exists
    const existingProgress = await query(
      'SELECT id, completed FROM lesson_progress WHERE enrollment_id = ? AND lesson_id = ?',
      [enrollment.id, lessonId]
    );

    const isCompleted = completed ? 1 : 0;

    if (existingProgress.length > 0) {
      await query(
        'UPDATE lesson_progress SET completed = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
        [isCompleted, existingProgress[0].id]
      );
    } else {
      await query(
        'INSERT INTO lesson_progress (enrollment_id, lesson_id, completed, completed_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
        [enrollment.id, lessonId, isCompleted]
      );
    }

    // Recompute course progress
    const [totalRes] = await query(
      `SELECT COUNT(l.id) AS total_lessons
       FROM lessons l
       JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = ?`,
      [courseId]
    );
    const totalLessons = totalRes ? totalRes.total_lessons : 0;

    const [compRes] = await query(
      'SELECT COUNT(id) AS completed_lessons FROM lesson_progress WHERE enrollment_id = ? AND completed = 1',
      [enrollment.id]
    );
    const completedLessons = compRes ? compRes.completed_lessons : 0;

    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Check if course should be marked completed
    let isCourseFullyCompleted = false;
    if (completedLessons >= totalLessons && totalLessons > 0) {
      // Check if quiz exists and is passed
      const quizzes = await query('SELECT id, passing_score FROM quizzes WHERE course_id = ?', [courseId]);
      if (quizzes.length > 0) {
        const quiz = quizzes[0];
        const attempts = await query(
          'SELECT id FROM quiz_attempts WHERE quiz_id = ? AND user_id = ? AND passed = 1',
          [quiz.id, userId]
        );
        if (attempts.length > 0) {
          // Both all lessons completed and quiz passed!
          await query(
            'UPDATE enrollments SET status = "completed", completed_at = COALESCE(completed_at, CURRENT_TIMESTAMP) WHERE id = ?',
            [enrollment.id]
          );
          isCourseFullyCompleted = true;
        }
      } else {
        // No quiz required, course is completed
        await query(
          'UPDATE enrollments SET status = "completed", completed_at = COALESCE(completed_at, CURRENT_TIMESTAMP) WHERE id = ?',
          [enrollment.id]
        );
        isCourseFullyCompleted = true;
      }
    }

    return res.json({
      success: true,
      message: isCompleted ? 'Lesson marked as completed!' : 'Lesson marked as incomplete.',
      lessonId,
      completed: !!isCompleted,
      completed_lessons: completedLessons,
      total_lessons: totalLessons,
      progress,
      isCourseFullyCompleted
    });
  } catch (error) {
    next(error);
  }
};

// Module Management (Admin)
const createModule = async (req, res, next) => {
  try {
    const { courseId, title, description, orderNumber } = req.body;
    if (!courseId || !title) {
      return res.status(400).json({ success: false, message: 'courseId and title are required.' });
    }

    const result = await query(
      'INSERT INTO modules (course_id, title, description, order_number) VALUES (?, ?, ?, ?)',
      [courseId, title.trim(), description || '', orderNumber || 1]
    );

    const newModule = await query('SELECT * FROM modules WHERE id = ?', [result.insertId]);
    return res.status(201).json({ success: true, module: newModule[0] });
  } catch (error) {
    next(error);
  }
};

const updateModule = async (req, res, next) => {
  try {
    const moduleId = req.params.id;
    const { title, description, orderNumber } = req.body;

    await query(
      'UPDATE modules SET title = COALESCE(?, title), description = COALESCE(?, description), order_number = COALESCE(?, order_number) WHERE id = ?',
      [title, description, orderNumber, moduleId]
    );

    const updated = await query('SELECT * FROM modules WHERE id = ?', [moduleId]);
    return res.json({ success: true, module: updated[0] });
  } catch (error) {
    next(error);
  }
};

const deleteModule = async (req, res, next) => {
  try {
    const moduleId = req.params.id;
    await query('DELETE FROM modules WHERE id = ?', [moduleId]);
    return res.json({ success: true, message: 'Module deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// Lesson Management (Admin)
const createLesson = async (req, res, next) => {
  try {
    const { moduleId, title, description, videoUrl, resourceUrl, duration, orderNumber } = req.body;
    if (!moduleId || !title) {
      return res.status(400).json({ success: false, message: 'moduleId and title are required.' });
    }

    const result = await query(
      `INSERT INTO lessons (module_id, title, description, video_url, resource_url, duration, order_number)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [moduleId, title.trim(), description || '', videoUrl || null, resourceUrl || null, duration || '15 mins', orderNumber || 1]
    );

    const newLesson = await query('SELECT * FROM lessons WHERE id = ?', [result.insertId]);
    return res.status(201).json({ success: true, lesson: newLesson[0] });
  } catch (error) {
    next(error);
  }
};

const updateLesson = async (req, res, next) => {
  try {
    const lessonId = req.params.id;
    const { title, description, videoUrl, resourceUrl, duration, orderNumber } = req.body;

    await query(
      `UPDATE lessons 
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           video_url = COALESCE(?, video_url),
           resource_url = COALESCE(?, resource_url),
           duration = COALESCE(?, duration),
           order_number = COALESCE(?, order_number)
       WHERE id = ?`,
      [title, description, videoUrl, resourceUrl, duration, orderNumber, lessonId]
    );

    const updated = await query('SELECT * FROM lessons WHERE id = ?', [lessonId]);
    return res.json({ success: true, lesson: updated[0] });
  } catch (error) {
    next(error);
  }
};

const deleteLesson = async (req, res, next) => {
  try {
    const lessonId = req.params.id;
    await query('DELETE FROM lessons WHERE id = ?', [lessonId]);
    return res.json({ success: true, message: 'Lesson deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourseCurriculum,
  updateLessonProgress,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson
};
