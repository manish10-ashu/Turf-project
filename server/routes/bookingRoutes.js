const express = require('express');
const router = express.Router();
const {
  getAvailableSlots,
  createBooking,
  getMyBookings,
  cancelBooking,
  updateBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { validateBooking } = require('../utils/validators');

// Public slots route
router.get('/slots/:date', getAvailableSlots);

// Protected user booking routes
router.route('/')
  .post(protect, validateBooking, createBooking)
  .get(protect, getMyBookings);

router.route('/:id')
  .put(protect, validateBooking, updateBooking)
  .delete(protect, cancelBooking);

module.exports = router;
