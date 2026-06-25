const dns = require("dns")
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();


console.log("MONGO_URI =", process.env.MONGO_URI);

async function startServer() {
  // Connect to Database first!
  await connectDB();
 
  const app = express();

  // Security Middleware
  app.use(helmet({
    crossOriginResourcePolicy: false, // Allows loading uploaded files cross-origin
  }));
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }));

  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Create upload directory if it doesn't exist
  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Serve uploaded images statically
  app.use('/uploads', express.static(uploadDir));

  // Rate Limiter
  const { apiLimiter } = require('./middleware/rateLimiter');
  app.use('/api', apiLimiter);

  // Routes mounting (now require after connectDB!)
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/bookings', require('./routes/bookingRoutes'));
  app.use('/api/pricing', require('./routes/pricingRoutes'));
  app.use('/api/gallery', require('./routes/galleryRoutes'));
  app.use('/api/reviews', require('./routes/reviewRoutes'));
  app.use('/api/contact', require('./routes/contactRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes'));

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({ success: true, message: 'Homeground Turf API is running!' });
  });

  // Error Handler Middleware
  const errorHandler = require('./middleware/errorHandler');
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

startServer();
