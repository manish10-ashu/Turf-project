const mongoose = require('mongoose');

const contactSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const ContactMongoose = mongoose.model('Contact', contactSchema);

let mockContact = null;
function getContactModel() {
  if (global.useMockDb) {
    if (!mockContact) {
      const MockModel = require('./dbMock');
      mockContact = new MockModel('Contact');
    }
    return mockContact;
  } else {
    return ContactMongoose;
  }
}

module.exports = global.useMockDb ? new Proxy({}, {
  get: function(target, prop, receiver) {
    const model = getContactModel();
    return Reflect.get(model, prop, receiver);
  }
}) : ContactMongoose;
