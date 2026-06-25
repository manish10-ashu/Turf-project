const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getDashboardStats,
  getAllBookings,
  getAllUsers,
  updateBookingStatus,
  getAllReviews,
  approveReview,
  getAllContacts,
  markContactAsRead,
  deleteAllBookings,
  getSettings,
updateSettings
} = require('../controllers/adminController');
router.get('/public-settings', getSettings);
// Secure all routes below to protect + admin
router.use(protect);
router.use(admin);

router.get('/stats', getDashboardStats);
router.route('/bookings')
  .get(getAllBookings);
router.route('/bookings/:id')
  .put(updateBookingStatus);

router.route('/users')
  .get(getAllUsers);

router.route('/reviews')
  .get(getAllReviews);
router.route('/reviews/:id')
  .put(approveReview);

router.route('/contacts')
  .get(getAllContacts);
router.route('/contacts/:id')
  .put(markContactAsRead);
router.delete(
  '/bookings',
  protect,
  admin,
  deleteAllBookings
);

router.get('/settings', protect, admin, getSettings);
router.put('/settings', protect, admin, updateSettings);

module.exports = router;
