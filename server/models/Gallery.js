const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Football', 'Cricket', 'Facilities', 'Events'],
      default: 'Football',
    },
    order: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const GalleryMongoose = mongoose.model('Gallery', gallerySchema);

let mockGallery = null;
function getGalleryModel() {
  if (global.useMockDb) {
    if (!mockGallery) {
      const MockModel = require('./dbMock');
      mockGallery = new MockModel('Gallery');
    }
    return mockGallery;
  } else {
    return GalleryMongoose;
  }
}

module.exports = global.useMockDb ? new Proxy({}, {
  get: function(target, prop, receiver) {
    const model = getGalleryModel();
    return Reflect.get(model, prop, receiver);
  }
}) : GalleryMongoose;
