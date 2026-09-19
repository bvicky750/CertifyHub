const { query } = require('../config/db');

// Helper to generate URL-safe slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Get all courses with filtering, search, and counts
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    const { search, category, level, status } = req.query;

    let sql = `
      SELECT 
        c.*,
        COUNT(DISTINCT m.id) AS module_count,
        COUNT(DISTINCT l.id) AS lesson_count,
        COUNT(DISTINCT e.id) AS student_count
      FROM courses c
      LEFT JOIN modules m ON m.course_id = c.id
      LEFT JOIN lessons l ON l.module_id = m.id
      LEFT JOIN enrollments e ON e.course_id = c.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by published unless admin explicitly requests draft/all
    if (status) {
      sql += ' AND c.status = ?';
      params.push(status);
    } else {
      sql += " AND c.status = 'published'";
    }

    if (category && category !== 'All') {
      sql += ' AND c.category = ?';
      params.push(category);
    }

    if (level && level !== 'All') {
      sql += ' AND c.level = ?';
      params.push(level);
    }

    if (search) {
      sql += ' AND (c.title LIKE ? OR c.description LIKE ? OR c.instructor_name LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ' GROUP BY c.id ORDER BY c.created_at DESC';

    const courses = await query(sql, params);

    return res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID or slug with modules and lessons
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
  try {
    const identifier = req.params.id;
    const isNumeric = /^\d+$/.test(identifier);

    const courseQuery = isNumeric
      ? 'SELECT * FROM courses WHERE id = ?'
      : 'SELECT * FROM courses WHERE slug = ?';
    
    const courses = await query(courseQuery, [identifier]);

    if (!courses || courses.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const course = courses[0];

    // Fetch modules ordered by order_number
    const modules = await query(
      'SELECT * FROM modules WHERE course_id = ? ORDER BY order_number ASC, id ASC',
      [course.id]
    );

    // Fetch all lessons for modules in this course
    const lessons = await query(
      `SELECT l.* FROM lessons l 
       JOIN modules m ON l.module_id = m.id 
       WHERE m.course_id = ? 
       ORDER BY l.order_number ASC, l.id ASC`,
      [course.id]
    );

    // Nest lessons into modules
    const modulesWithLessons = modules.map((mod) => ({
      ...mod,
      lessons: lessons.filter((les) => les.module_id === mod.id)
    }));

    // Fetch quiz for this course
    const quizzes = await query(
      `SELECT q.id, q.course_id, q.title, q.description, q.passing_score,
              COUNT(qst.id) AS question_count
       FROM quizzes q
       LEFT JOIN questions qst ON qst.quiz_id = q.id
       WHERE q.course_id = ?
       GROUP BY q.id`,
      [course.id]
    );

    const totalLessonsCount = lessons.length;

    return res.json({
      success: true,
      course: {
        ...course,
        module_count: modules.length,
        lesson_count: totalLessonsCount,
        modules: modulesWithLessons,
        quiz: quizzes.length > 0 ? quizzes[0] : null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      description,
      short_description,
      instructor_name,
      category,
      level,
      duration,
      thumbnail,
      status
    } = req.body;

    if (!title || !description || !short_description || !instructor_name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required course details.'
      });
    }

    let slug = slugify(title);
    // Ensure slug uniqueness
    const existingSlug = await query('SELECT id FROM courses WHERE slug = ?', [slug]);
    if (existingSlug.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const defaultThumbnail = thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';

    const result = await query(
      `INSERT INTO courses 
        (title, slug, description, short_description, instructor_name, category, level, duration, thumbnail, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        slug,
        description.trim(),
        short_description.trim(),
        instructor_name.trim(),
        category.trim(),
        level || 'Beginner',
        duration || '8 Weeks',
        defaultThumbnail,
        status || 'draft',
        req.user.id
      ]
    );

    const newCourse = await query('SELECT * FROM courses WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      course: newCourse[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const {
      title,
      description,
      short_description,
      instructor_name,
      category,
      level,
      duration,
      thumbnail,
      status
    } = req.body;

    const existing = await query('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    await query(
      `UPDATE courses 
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           short_description = COALESCE(?, short_description),
           instructor_name = COALESCE(?, instructor_name),
           category = COALESCE(?, category),
           level = COALESCE(?, level),
           duration = COALESCE(?, duration),
           thumbnail = COALESCE(?, thumbnail),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [
        title,
        description,
        short_description,
        instructor_name,
        category,
        level,
        duration,
        thumbnail,
        status,
        courseId
      ]
    );

    const updated = await query('SELECT * FROM courses WHERE id = ?', [courseId]);

    return res.json({
      success: true,
      message: 'Course updated successfully.',
      course: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const existing = await query('SELECT id FROM courses WHERE id = ?', [courseId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    await query('DELETE FROM courses WHERE id = ?', [courseId]);

    return res.json({
      success: true,
      message: 'Course deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
