const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAdminStudents,
  getAdminEnrollments,
  getAdminCertificates
} = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware, adminMiddleware);

router.get('/stats', getAdminStats);
router.get('/students', getAdminStudents);
router.get('/enrollments', getAdminEnrollments);
router.get('/certificates', getAdminCertificates);

module.exports = router;
