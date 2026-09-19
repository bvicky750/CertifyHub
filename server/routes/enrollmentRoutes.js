const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getMyEnrollments,
  checkEnrollment
} = require('../controllers/enrollmentController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', enrollCourse);
router.get('/my', getMyEnrollments);
router.get('/:courseId', checkEnrollment);

module.exports = router;
