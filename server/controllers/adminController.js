const { query } = require('../config/db');

// @desc    Get comprehensive admin analytics & statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    // Total Students
    const [studentsCount] = await query("SELECT COUNT(*) AS total FROM users WHERE role = 'student'");
    // Total Courses
    const [coursesCount] = await query('SELECT COUNT(*) AS total FROM courses');
    // Published Courses
    const [publishedCount] = await query("SELECT COUNT(*) AS total FROM courses WHERE status = 'published'");
    // Total Enrollments
    const [enrollmentsCount] = await query('SELECT COUNT(*) AS total FROM enrollments');
    // Completed Courses
    const [completedCount] = await query("SELECT COUNT(*) AS total FROM enrollments WHERE status = 'completed'");
    // Certificates Issued
    const [certificatesCount] = await query('SELECT COUNT(*) AS total FROM certificates');

    // Recent enrollments (latest 5)
    const recentEnrollments = await query(
      `SELECT e.id, e.enrolled_at, e.status, u.name AS student_name, u.email AS student_email, c.title AS course_title
       FROM enrollments e
       JOIN users u ON e.user_id = u.id
       JOIN courses c ON e.course_id = c.id
       ORDER BY e.enrolled_at DESC
       LIMIT 6`
    );

    // Recent certificates (latest 5)
    const recentCertificates = await query(
      `SELECT cert.id, cert.certificate_number, cert.issue_date, u.name AS student_name, c.title AS course_title
       FROM certificates cert
       JOIN users u ON cert.user_id = u.id
       JOIN courses c ON cert.course_id = c.id
       ORDER BY cert.issue_date DESC
       LIMIT 6`
    );

    return res.json({
      success: true,
      stats: {
        totalStudents: studentsCount.total,
        totalCourses: coursesCount.total,
        publishedCourses: publishedCount.total,
        totalEnrollments: enrollmentsCount.total,
        completedCourses: completedCount.total,
        certificatesIssued: certificatesCount.total,
        recentEnrollments,
        recentCertificates
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students with metrics
// @route   GET /api/admin/students
// @access  Private/Admin
const getAdminStudents = async (req, res, next) => {
  try {
    const students = await query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        u.profile_image,
        u.created_at,
        COUNT(DISTINCT e.id) AS enrolled_count,
        COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN e.id END) AS completed_count,
        COUNT(DISTINCT cert.id) AS certificates_count
       FROM users u
       LEFT JOIN enrollments e ON e.user_id = u.id
       LEFT JOIN certificates cert ON cert.user_id = u.id
       WHERE u.role = 'student'
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );

    return res.json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enrollments
// @route   GET /api/admin/enrollments
// @access  Private/Admin
const getAdminEnrollments = async (req, res, next) => {
  try {
    const { status } = req.query;
    let sql = `
      SELECT 
        e.id,
        e.enrolled_at,
        e.completed_at,
        e.status,
        u.id AS user_id,
        u.name AS student_name,
        u.email AS student_email,
        c.id AS course_id,
        c.title AS course_title,
        c.category
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND e.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY e.enrolled_at DESC';

    const enrollments = await query(sql, params);

    return res.json({
      success: true,
      count: enrollments.length,
      enrollments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all issued certificates
// @route   GET /api/admin/certificates
// @access  Private/Admin
const getAdminCertificates = async (req, res, next) => {
  try {
    const certificates = await query(
      `SELECT 
        cert.id,
        cert.certificate_number,
        cert.verification_code,
        cert.issue_date,
        cert.certificate_url,
        u.id AS user_id,
        u.name AS student_name,
        u.email AS student_email,
        c.id AS course_id,
        c.title AS course_title,
        c.instructor_name
       FROM certificates cert
       JOIN users u ON cert.user_id = u.id
       JOIN courses c ON cert.course_id = c.id
       ORDER BY cert.issue_date DESC`
    );

    return res.json({
      success: true,
      count: certificates.length,
      certificates
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAdminStudents,
  getAdminEnrollments,
  getAdminCertificates
};
