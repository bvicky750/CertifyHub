const { query } = require('../config/db');

// @desc    Enroll authenticated user in a course
// @route   POST /api/enrollments
// @access  Private/Student
const enrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Course ID is required.' });
    }

    // Verify course exists
    const courses = await query('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (courses.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Check duplicate enrollment
    const existing = await query(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course.',
        enrollment: existing[0]
      });
    }

    // Create enrollment
    const result = await query(
      'INSERT INTO enrollments (user_id, course_id, status) VALUES (?, ?, ?)',
      [userId, courseId, 'active']
    );

    const newEnrollment = await query('SELECT * FROM enrollments WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      success: true,
      message: 'Successfully enrolled! Start your learning journey today.',
      enrollment: newEnrollment[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enrollments for logged-in student with dynamic progress
// @route   GET /api/enrollments/my
// @access  Private
const getMyEnrollments = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const enrollments = await query(
      `SELECT 
        e.id AS enrollment_id,
        e.user_id,
        e.course_id,
        e.enrolled_at,
        e.completed_at,
        e.status AS enrollment_status,
        c.title AS course_title,
        c.slug AS course_slug,
        c.short_description,
        c.instructor_name,
        c.category,
        c.level,
        c.duration,
        c.thumbnail,
        cert.certificate_number,
        cert.verification_code
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       LEFT JOIN certificates cert ON cert.user_id = e.user_id AND cert.course_id = e.course_id
       WHERE e.user_id = ?
       ORDER BY e.enrolled_at DESC`,
      [userId]
    );

    // Calculate dynamic progress for each enrollment
    const enriched = await Promise.all(
      enrollments.map(async (item) => {
        // Total lessons in this course
        const [totalLessonsResult] = await query(
          `SELECT COUNT(l.id) AS total_lessons
           FROM lessons l
           JOIN modules m ON l.module_id = m.id
           WHERE m.course_id = ?`,
          [item.course_id]
        );
        const totalLessons = totalLessonsResult ? totalLessonsResult.total_lessons : 0;

        // Completed lessons for this enrollment
        const [completedLessonsResult] = await query(
          `SELECT COUNT(id) AS completed_lessons
           FROM lesson_progress
           WHERE enrollment_id = ? AND completed = 1`,
          [item.enrollment_id]
        );
        const completedLessons = completedLessonsResult ? completedLessonsResult.completed_lessons : 0;

        const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        return {
          ...item,
          total_lessons: totalLessons,
          completed_lessons: completedLessons,
          progress
        };
      })
    );

    return res.json({
      success: true,
      count: enriched.length,
      enrollments: enriched
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check enrollment status for a specific course
// @route   GET /api/enrollments/:courseId
// @access  Private
const checkEnrollment = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    const enrollments = await query(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (enrollments.length === 0) {
      return res.json({
        success: true,
        enrolled: false,
        enrollment: null,
        progress: 0
      });
    }

    const enrollment = enrollments[0];

    // Total lessons
    const [totalRes] = await query(
      `SELECT COUNT(l.id) AS total_lessons
       FROM lessons l
       JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = ?`,
      [courseId]
    );
    const totalLessons = totalRes ? totalRes.total_lessons : 0;

    // Completed lessons
    const [compRes] = await query(
      `SELECT COUNT(id) AS completed_lessons
       FROM lesson_progress
       WHERE enrollment_id = ? AND completed = 1`,
      [enrollment.id]
    );
    const completedLessons = compRes ? compRes.completed_lessons : 0;

    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Check certificate
    const certs = await query(
      'SELECT * FROM certificates WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    return res.json({
      success: true,
      enrolled: true,
      enrollment,
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      progress,
      certificate: certs.length > 0 ? certs[0] : null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enrollCourse,
  getMyEnrollments,
  checkEnrollment
};
