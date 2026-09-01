const express = require('express');
const router = express.Router();
const { getProviders, getProviderById, submitVerification, addReview } = require('../controllers/providerController');

router.get('/', getProviders);
router.get('/:id', getProviderById);
router.post('/verify', submitVerification);
router.post('/review', addReview);

module.exports = router;
