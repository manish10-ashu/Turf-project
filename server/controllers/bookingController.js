const Booking = require('../models/Booking');
const Pricing = require('../models/Pricing');

// Standard slots lists
const STANDARD_SLOTS = [
  "06:00 - 07:00",
  "07:00 - 08:00",
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
  "21:00 - 22:00",
  "22:00 - 23:00"
];

// @desc    Get available slots for a date
// @route   GET /api/bookings/slots/:date
// @access  Public
console.log("GET SLOTS CALLED");
const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.params; // format YYYY-MM-DD
    
    // Fetch all active (non-cancelled) bookings for this date
    const bookings = await Booking.find({date,status: { $in: ['pending', 'confirmed'] }});
    
    // Create map of booked slots
    const bookedSlots = new Set();
    bookings.forEach(booking => {
      bookedSlots.add(booking.timeSlot);
    });

    // Get pricing mapping
    const pricings = await Pricing.find({});
    const pricingMap = {};
    pricings.forEach(p => {
      pricingMap[p.timeSlot] = p;
    });

    // Determine day of week for pricing (weekend vs weekday)
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday

    // Prepare slots list with availability and price
   const slots = STANDARD_SLOTS.map(slot => {
  const isBooked = bookedSlots.has(slot);
  const priceConfig = pricingMap[slot];
  const isAdminAvailable = priceConfig ? priceConfig.isAvailable : true;

  let price = isWeekend ? 1800 : 1400;
  let isPopular = false;

  if (priceConfig) {
    price = isWeekend
      ? priceConfig.weekendPrice
      : priceConfig.weekdayPrice;

    isPopular = priceConfig.isPopular;
  }

  return {
    timeSlot: slot,
    available: !isBooked && isAdminAvailable,
    isAvailable: isAdminAvailable,
    price,
    isPopular
  };
});
    console.log("SLOTS:", slots);
    res.json({ success: true, date, slots });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { date, timeSlot, players, sport, totalPrice } = req.body;

    if (!date || !timeSlot || !players || !sport || !totalPrice) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    // Double booking check:
    const existingBooking = await Booking.findOne({
      date,
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({ 
        success: false, 
        message: 'This slot is already booked. Please choose another slot.' 
      });
    }
    const existingPendingBooking = await Booking.findOne({
  user: req.user.id,
  status: 'pending',
  createdAt: {
    $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
  }
});
if (existingPendingBooking) {
  return res.status(400).json({
    success: false,
    message: 'You already have a booking awaiting approval.'
  });
}

    const booking = await Booking.create({
      user: req.user._id,
      date,
      timeSlot,
      players,
      sport,
      totalPrice,
      status: 'pending'
    });

    const whatsappMessage = `🏟️ New Booking Request

Date: ${date}
Time: ${timeSlot}
Players: ${players}
Sport: ${sport}
Amount: ₹${totalPrice}`;

const whatsappUrl =
  `https://wa.me/${process.env.OWNER_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;

res.status(201).json({
  success: true,
  booking,
  whatsappUrl
});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check ownership (unless admin)
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a booking (change date/time slot)
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = async (req, res) => {
  try {
    const { date, timeSlot, players, sport, totalPrice } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check ownership
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // Check if updating slot creates a double booking
    if (date && timeSlot && (date !== booking.date || timeSlot !== booking.timeSlot)) {
      const existingBooking = await Booking.findOne({
        _id: { $ne: booking._id },
        date,
        timeSlot,
        status: { $ne: 'cancelled' }
      });

      if (existingBooking) {
        return res.status(400).json({ 
          success: false, 
          message: 'The new slot is already booked. Please choose another slot.' 
        });
      }
    }

    booking.date = date || booking.date;
    booking.timeSlot = timeSlot || booking.timeSlot;
    booking.players = players || booking.players;
    booking.sport = sport || booking.sport;
    booking.totalPrice = totalPrice || booking.totalPrice;

    const updatedBooking = await booking.save();

    res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAvailableSlots,
  createBooking,
  getMyBookings,
  cancelBooking,
  updateBooking
};
