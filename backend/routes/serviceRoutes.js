const express = require('express');
const router = express.Router();
const { getCategories, getServices, getServiceById } = require('../controllers/serviceController');

router.get('/categories', getCategories);
router.get('/', getServices);
router.get('/:id', getServiceById);

module.exports = router;
