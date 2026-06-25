const mongoose = require('mongoose');
require('dotenv').config(); // Ensure env vars are loaded

// Optional DNS configuration (can be omitted if not needed)
// const dns = require('dns');
// dns.setServers(['1.1.1.1', '8.8.8.8']);

const connectDB = async () => {
  try {
    console.log('Attempting MongoDB connection to:', process.env.MONGO_URI.replace(/\/\/.*@/, '//****@'));
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useMockDb = false;
  } catch (error) {
    console.error('⚠️ MongoDB connection error:', error.message);
    console.warn('Falling back to mock JSON DB');
    global.useMockDb = true;
  }
};

module.exports = connectDB;
