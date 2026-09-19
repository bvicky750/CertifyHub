const express = require('express');
const router = express.Router();
const {
  generateCertificate,
  getMyCertificates,
  verifyCertificate,
  downloadCertificatePdf
} = require('../controllers/certificateController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public verification routes
router.get('/verify/:identifier', verifyCertificate);
router.get('/:id/pdf', downloadCertificatePdf);

// Protected student routes
router.use(authMiddleware);
router.post('/generate', generateCertificate);
router.get('/my', getMyCertificates);

module.exports = router;
