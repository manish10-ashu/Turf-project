const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  turfName: {
    type: String,
    default: 'Homeground Turf'
  },
  whatsappNumber: {
    type: String,
    default: ''
  },
  contactNumber: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  upiId: {
    type: String,
    default: ''
  },
  email: {
  type: String,
  default: ''
},
heroTitle: { type: String, default: "" },
heroSubtitle: { type: String, default: "" },
heroDescription: { type: String, default: "" },
gallery: {
  type: [String],
  default: []
}
});

module.exports = mongoose.model('Settings', settingsSchema);