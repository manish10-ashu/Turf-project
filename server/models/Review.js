const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const ReviewMongoose = mongoose.model('Review', reviewSchema);

let mockReview = null;
function getReviewModel() {
  if (global.useMockDb) {
    if (!mockReview) {
      const MockModel = require('./dbMock');
      mockReview = new MockModel('Review');
    }
    return mockReview;
  } else {
    return ReviewMongoose;
  }
}

module.exports = global.useMockDb ? new Proxy({}, {
  get: function(target, prop, receiver) {
    const model = getReviewModel();
    return Reflect.get(model, prop, receiver);
  }
}) : ReviewMongoose;
