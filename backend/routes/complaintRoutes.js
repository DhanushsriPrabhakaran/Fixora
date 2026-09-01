const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, resolveComplaint } = require('../controllers/complaintController');

router.post('/', createComplaint);
router.get('/', getComplaints);
router.patch('/:id/resolve', resolveComplaint);

module.exports = router;
