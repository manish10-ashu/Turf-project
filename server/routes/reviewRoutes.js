const express = require('express');
const router = express.Router();
const { getApprovedReviews, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { validateReview } = require('../utils/validators');

// Optional auth: if user is logged in, attach their ID
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const { protect } = require('../middleware/auth');
      return protect(req, res, next);
    } catch (err) {
      // ignore token error, allow guest submission
    }
  }
  next();
};

router.route('/')
  .get(getApprovedReviews)
  .post(optionalProtect, validateReview, createReview);

module.exports = router;
