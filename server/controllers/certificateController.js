const { query } = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');

// @desc    Generate a new certificate upon satisfying completion criteria
// @route   POST /api/certificates/generate
// @access  Private/Student
const generateCertificate = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required.' });
    }

    // 1. Check existing certificate
    const existingCert = await query(
      `SELECT cert.*, c.title AS course_title, c.instructor_name, u.name AS student_name 
       FROM certificates cert
       JOIN courses c ON cert.course_id = c.id
       JOIN users u ON cert.user_id = u.id
       WHERE cert.user_id = ? AND cert.course_id = ?`,
      [userId, courseId]
    );

    if (existingCert.length > 0) {
      return res.json({
        success: true,
        message: 'Certificate already generated.',
        certificate: existingCert[0]
      });
    }

    // 2. Verify course enrollment
    const enrollments = await query(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (enrollments.length === 0) {
      return res.status(400).json({ success: false, message: 'You are not enrolled in this course.' });
    }

    const enrollment = enrollments[0];

    // 3. Verify all lessons are completed
    const [totalLessonsRes] = await query(
      `SELECT COUNT(l.id) AS total_lessons
       FROM lessons l
       JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = ?`,
      [courseId]
    );
    const totalLessons = totalLessonsRes ? totalLessonsRes.total_lessons : 0;

    const [compLessonsRes] = await query(
      'SELECT COUNT(id) AS completed_lessons FROM lesson_progress WHERE enrollment_id = ? AND completed = 1',
      [enrollment.id]
    );
    const completedLessons = compLessonsRes ? compLessonsRes.completed_lessons : 0;

    if (completedLessons < totalLessons || totalLessons === 0) {
      return res.status(400).json({
        success: false,
        message: `Incomplete lessons: You have completed ${completedLessons} of ${totalLessons} lessons. Complete all lessons first.`
      });
    }

    // 4. Verify Quiz is passed
    const quizzes = await query('SELECT id, passing_score FROM quizzes WHERE course_id = ?', [courseId]);
    if (quizzes.length > 0) {
      const quiz = quizzes[0];
      const attempts = await query(
        'SELECT * FROM quiz_attempts WHERE quiz_id = ? AND user_id = ? AND passed = 1',
        [quiz.id, userId]
      );
      if (attempts.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'You must achieve a passing score on the final course quiz before generating your certificate.'
        });
      }
    }

    // 5. Requirements met! Update enrollment to completed if not already
    await query(
      'UPDATE enrollments SET status = "completed", completed_at = COALESCE(completed_at, CURRENT_TIMESTAMP) WHERE id = ?',
      [enrollment.id]
    );

    // 6. Generate unique Certificate Number and Verification Code
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const certificateNumber = `CERT-2026-${randomDigits}`;
    const verificationCode = `VERIFY-${uuidv4().substring(0, 8).toUpperCase()}`;
    const certificateUrl = `/certificates/${certificateNumber}.pdf`;

    const result = await query(
      `INSERT INTO certificates 
        (certificate_number, user_id, course_id, certificate_url, verification_code)
       VALUES (?, ?, ?, ?, ?)`,
      [certificateNumber, userId, courseId, certificateUrl, verificationCode]
    );

    const generated = await query(
      `SELECT cert.*, c.title AS course_title, c.instructor_name, u.name AS student_name 
       FROM certificates cert
       JOIN courses c ON cert.course_id = c.id
       JOIN users u ON cert.user_id = u.id
       WHERE cert.id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Certificate successfully generated! Congratulations!',
      certificate: generated[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all certificates belonging to logged in user
// @route   GET /api/certificates/my
// @access  Private
const getMyCertificates = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const certs = await query(
      `SELECT cert.*, c.title AS course_title, c.slug AS course_slug, c.category, c.thumbnail, c.instructor_name, u.name AS student_name
       FROM certificates cert
       JOIN courses c ON cert.course_id = c.id
       JOIN users u ON cert.user_id = u.id
       WHERE cert.user_id = ?
       ORDER BY cert.issue_date DESC`,
      [userId]
    );

    return res.json({
      success: true,
      count: certs.length,
      certificates: certs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify certificate publicly by certificate_number or verification_code
// @route   GET /api/certificates/verify/:identifier
// @access  Public
const verifyCertificate = async (req, res, next) => {
  try {
    const identifier = req.params.identifier.trim();

    const certs = await query(
      `SELECT 
        cert.id,
        cert.certificate_number,
        cert.verification_code,
        cert.issue_date,
        u.name AS student_name,
        c.title AS course_title,
        c.instructor_name,
        c.category,
        c.level,
        c.duration
       FROM certificates cert
       JOIN users u ON cert.user_id = u.id
       JOIN courses c ON cert.course_id = c.id
       WHERE cert.certificate_number = ? OR cert.verification_code = ?`,
      [identifier, identifier]
    );

    if (certs.length === 0) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Certificate not found or credential invalid.'
      });
    }

    const cert = certs[0];

    return res.json({
      success: true,
      valid: true,
      message: 'Certificate verified successfully.',
      certificate: {
        certificate_number: cert.certificate_number,
        verification_code: cert.verification_code,
        issue_date: cert.issue_date,
        student_name: cert.student_name,
        course_title: cert.course_title,
        instructor_name: cert.instructor_name,
        category: cert.category,
        issuing_organization: 'CertifyHub Online Academy',
        status: 'Valid & Authenticated'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download server-generated PDF Certificate
// @route   GET /api/certificates/:id/pdf
// @access  Public
const downloadCertificatePdf = async (req, res, next) => {
  try {
    const certId = req.params.id;

    const certs = await query(
      `SELECT cert.*, u.name AS student_name, c.title AS course_title, c.instructor_name
       FROM certificates cert
       JOIN users u ON cert.user_id = u.id
       JOIN courses c ON cert.course_id = c.id
       WHERE cert.id = ? OR cert.certificate_number = ?`,
      [certId, certId]
    );

    if (certs.length === 0) {
      return res.status(404).json({ success: false, message: 'Certificate not found.' });
    }

    const cert = certs[0];

    // Create PDF in landscape A4
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margin: 40
    });

    const filename = `Certificate-${cert.course_title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    // Decorative Borders
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(3).stroke('#0f172a');
    doc.rect(26, 26, doc.page.width - 52, doc.page.height - 52).lineWidth(1).stroke('#0284c7');

    // Header Branding
    doc.moveDown(1.5);
    doc.font('Helvetica-Bold').fontSize(24).fillColor('#0f172a').text('CERTIFYHUB ONLINE ACADEMY', { align: 'center' });
    doc.fontSize(10).fillColor('#64748b').text('OFFICIAL ACCREDITED CERTIFICATION OF COMPLETION', { align: 'center', characterSpacing: 2 });

    doc.moveDown(2);
    doc.font('Helvetica').fontSize(14).fillColor('#475569').text('This is proudly presented to', { align: 'center' });

    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(28).fillColor('#0284c7').text(cert.student_name, { align: 'center' });

    doc.moveDown(1);
    doc.font('Helvetica').fontSize(13).fillColor('#334155').text('for successfully completing all rigorous curriculum requirements for', { align: 'center' });

    doc.moveDown(0.8);
    doc.font('Helvetica-Bold').fontSize(22).fillColor('#0f172a').text(cert.course_title, { align: 'center' });

    doc.moveDown(2);
    // Footer details in two columns
    const formattedDate = new Date(cert.issue_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const leftX = 80;
    const rightX = doc.page.width - 280;
    const currentY = doc.y;

    doc.fontSize(10).fillColor('#64748b').text(`Date Issued: ${formattedDate}`, leftX, currentY);
    doc.text(`Certificate ID: ${cert.certificate_number}`, leftX, currentY + 16);
    doc.text(`Verification Code: ${cert.verification_code}`, leftX, currentY + 32);

    doc.text(`Instructor: ${cert.instructor_name}`, rightX, currentY);
    doc.text('Authorized Academic Signature: _________________', rightX, currentY + 16);
    doc.text('Verify online at CertifyHub Portal', rightX, currentY + 32);

    doc.end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateCertificate,
  getMyCertificates,
  verifyCertificate,
  downloadCertificatePdf
};
