const Booking = require('../models/Booking');
const User = require('../models/User');
const Review = require('../models/Review');
const Contact = require('../models/Contact');
const Settings = require('../models/Settings');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments({ status: { $ne: 'cancelled' } });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const pendingReviews = await Review.countDocuments({ isApproved: false });
    const unreadMessages = await Contact.countDocuments({ isRead: false });

    // Revenue calculation
    const bookings = await Booking.find({ status: 'confirmed' });
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    // Recent Bookings (limit to 5)
    const recentBookings = await Booking.find({})
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalBookings,
        totalUsers,
        totalRevenue,
        pendingReviews,
        unreadMessages
      },
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email phone')
      .sort({ date: -1, timeSlot: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 const deleteAllBookings = async (req, res) => {
  try {
    await Booking.deleteMany({});

    res.json({
      success: true,
      message: 'All bookings deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// @desc    Manage booking status (Admin manual override)
// @route   PUT /api/admin/bookings/:id
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id).populate(
      'user',
      'name phone'
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status || booking.status;
    await booking.save();

    let whatsappUrl = null;

    if (booking.user?.phone) {
      const phone = booking.user.phone.replace(/\D/g, '');

      const message =
        status === 'confirmed'
          ? `✅ Your booking for ${booking.date} at ${booking.timeSlot} has been confirmed by Homeground Turf.`
          : `❌ Your booking for ${booking.date} at ${booking.timeSlot} has been rejected. Please choose another slot.`;

      whatsappUrl =
        `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
    }

    res.json({
      success: true,
      booking,
      whatsappUrl
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve/Reject review
// @route   PUT /api/admin/reviews/:id
// @access  Private/Admin
const approveReview = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.isApproved = isApproved;
    await review.save();

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all contact inquiries (Admin)
// @route   GET /api/admin/contacts
// @access  Private/Admin
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark inquiry as read
// @route   PUT /api/admin/contacts/:id
// @access  Private/Admin
const markContactAsRead = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    contact.isRead = true;
    await contact.save();

    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



const updateSettings = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    let settings = await Settings.findOne();
    settings.turfName = req.body.turfName;
    settings.whatsappNumber = req.body.whatsappNumber;
    settings.contactNumber = req.body.contactNumber;
    settings.address = req.body.address;
    settings.upiId = req.body.upiId;
    settings.email = req.body.email;
    settings.heroTitle = req.body.heroTitle;
    settings.heroSubtitle = req.body.heroSubtitle;
    settings.heroDescription = req.body.heroDescription;
    settings.gallery = req.body.gallery;

    await settings.save();

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
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
};
