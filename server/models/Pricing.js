const mongoose = require('mongoose');

const pricingSchema = mongoose.Schema(
  {
    timeSlot: {
      type: String, // e.g. "06:00 - 07:00"
      required: true,
      unique: true,
    },
    weekdayPrice: {
      type: Number,
      required: true,
    },
    weekendPrice: {
      type: Number,
      required: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
    type: Boolean,
    default: true
},
    sport: {
      type: String,
      enum: ['Football', 'Cricket', 'Both'],
      default: 'Both',
    }
  },
  {
    timestamps: true,
  }
);

const PricingMongoose = mongoose.model('Pricing', pricingSchema);

let mockPricing = null;
function getPricingModel() {
  if (global.useMockDb) {
    if (!mockPricing) {
      const MockModel = require('./dbMock');
      mockPricing = new MockModel('Pricing');
    }
    return mockPricing;
  } else {
    return PricingMongoose;
  }
}

module.exports = global.useMockDb ? new Proxy({}, {
  get: function(target, prop, receiver) {
    const model = getPricingModel();
    return Reflect.get(model, prop, receiver);
  }
}) : PricingMongoose;
