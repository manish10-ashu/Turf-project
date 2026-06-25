const Review = require('../models/Review');

// @desc    Get all approved reviews
// @route   GET /api/reviews
// @access  Public
const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Public (or Private depending on user signin)
const createReview = async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const review = await Review.create({
      user: req.user ? req.user._id : null,
      name,
      rating,
      comment,
      isApproved: false // Requires admin approval by default
    });

    res.status(201).json({ 
      success: true, 
      message: 'Review submitted! It will appear on the site once approved by an admin.',
      review 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getApprovedReviews,
  createReview
};
