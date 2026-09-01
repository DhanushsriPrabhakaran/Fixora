const express = require('express');
const router = express.Router();
const { getAnalytics, verifyProvider } = require('../controllers/adminController');

router.get('/analytics', getAnalytics);
router.patch('/provider/:id/verify', verifyProvider);

module.exports = router;
