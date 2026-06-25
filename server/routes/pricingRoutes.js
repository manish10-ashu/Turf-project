const express = require('express');
const router = express.Router();
const { getPricing, updatePricing } = require('../controllers/pricingController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(getPricing)
  .post(protect, admin, updatePricing);

module.exports = router;
