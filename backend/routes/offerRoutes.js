const express = require('express');
const router = express.Router();
const { getOffers, validateOffer } = require('../controllers/offerController');

router.get('/', getOffers);
router.post('/validate', validateOffer);

module.exports = router;
