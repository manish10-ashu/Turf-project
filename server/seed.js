const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

const seedData = async () => {
  try {
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homeground_turf');
      console.log('MongoDB connected for seeding...');
      global.useMockDb = false;
    } catch (dbErr) {
      console.warn('\n⚠️  MongoDB connection failed during seeding. Seeding to JSON Mock Database instead!');
      global.useMockDb = true;
    }

    // Dynamic import of models so they resolve to either Mongoose or MockModel based on global.useMockDb
    const User = require('./models/User');
    const Pricing = require('./models/Pricing');
    const Gallery = require('./models/Gallery');
    const Review = require('./models/Review');

    // Clear existing data
    await User.deleteMany();
    await Pricing.deleteMany();
    await Gallery.deleteMany();
    await Review.deleteMany();
    console.log('Existing database cleared.');

    // Seed Admin User
    await User.create({
      name: 'Admin Manager',
      email: 'admin@homeground.com',
      password: 'adminpassword123',
      phone: '+91 9999999999',
      role: 'admin'
    });
    
    // Seed Normal User
    await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@gmail.com',
      password: 'userpassword123',
      phone: '+91 9876543210',
      role: 'user'
    });

    console.log('Users seeded.');

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

    // Seed Pricing
    const pricingData = STANDARD_SLOTS.map((slot) => {
      const startHour = parseInt(slot.split(':')[0]);
      const isPopular = startHour >= 17 && startHour <= 21;
      let baseWeekday = 1400;
      let baseWeekend = 1800;

      if (startHour < 9) {
        baseWeekday = 1200;
        baseWeekend = 1500;
      } else if (isPopular) {
        baseWeekday = 1600;
        baseWeekend = 2000;
      }

      return {
        timeSlot: slot,
        weekdayPrice: baseWeekday,
        weekendPrice: baseWeekend,
        isPopular,
        sport: 'Both'
      };
    });

    await Pricing.insertMany(pricingData);
    console.log('Pricing slots seeded.');

    // Seed Reviews
    const reviews = [
      {
        name: 'Aman Negi',
        rating: 5,
        comment: 'Great quality turf! The lighting is fantastic for night matches. Clean washrooms and friendly staff.',
        isApproved: true
      },
      {
        name: 'Pooja Rawat',
        rating: 4,
        comment: 'Very easy to book and the pricing is reasonable. Best turf in Dehradun for small sided football!',
        isApproved: true
      },
      {
        name: 'Vikram Singh',
        rating: 5,
        comment: 'Awesome facility. The bounce and turf quality is top tier. Playing box cricket here is extremely fun.',
        isApproved: true
      }
    ];

    await Review.insertMany(reviews);
    console.log('Reviews seeded.');

    // Seed Gallery Items
    const galleryItems = [
      {
        title: 'Premium Turf Night View',
        category: 'Facilities',
        imageUrl: '/images/turf-hero.png',
        order: 1
      },
      {
        title: 'Aerial Field marking View',
        category: 'Facilities',
        imageUrl: '/images/turf-aerial.png',
        order: 2
      },
      {
        title: 'Action Match Play',
        category: 'Football',
        imageUrl: '/images/turf-action.png',
        order: 3
      },
      {
        title: 'Box Cricket Setup',
        category: 'Cricket',
        imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800',
        order: 4
      },
      {
        title: 'Community Football Event',
        category: 'Events',
        imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
        order: 5
      }
    ];

    await Gallery.insertMany(galleryItems);
    console.log('Gallery items seeded.');

    console.log('\nDatabase Seeding Successful! 🎉');
    console.log('---------------------------------------------');
    console.log('Admin Credentials: email: admin@homeground.com, password: adminpassword123');
    console.log('User Credentials: email: rahul@gmail.com, password: userpassword123');
    console.log('---------------------------------------------');
    process.exit();
  } catch (error) {
    console.error(`Error seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
