const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: String, // format YYYY-MM-DD
      required: true,
    },
    timeSlot: {
      type: String, // format "HH:MM - HH:MM" e.g. "06:00 - 07:00"
      required: true,
    },
    duration: {
      type: Number, // in hours, default 1
      default: 1,
    },
    players: {
      type: Number,
      required: true,
    },
    sport: {
      type: String,
      enum: ['Football', 'Cricket'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ date: 1, timeSlot: 1, sport: 1, status: 1 }, { unique: false });

const BookingMongoose = mongoose.model('Booking', bookingSchema);

let mockBooking = null;
function getBookingModel() {
  if (global.useMockDb) {
    if (!mockBooking) {
      const MockModel = require('./dbMock');
      mockBooking = new MockModel('Booking');
    }
    return mockBooking;
  } else {
    return BookingMongoose;
  }
}

module.exports = global.useMockDb ? new Proxy({}, {
  get: function(target, prop, receiver) {
    const model = getBookingModel();
    return Reflect.get(model, prop, receiver);
  }
}) : BookingMongoose;
