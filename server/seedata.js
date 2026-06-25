const dns = require('dns');

dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
]);

const mongoose = require('mongoose');
require('dotenv').config();

const Gallery = require('./models/Gallery');
const Pricing = require('./models/Pricing');

const galleryData = require('./data/gallery.json');
const pricingData = require('./data/pricing.json');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to MongoDB');

    await Gallery.deleteMany();
    await Pricing.deleteMany();

    await Gallery.insertMany(
      galleryData.map(({ _id, createdAt, updatedAt, ...rest }) => rest)
    );

    await Pricing.insertMany(
      pricingData.map(({ _id, createdAt, updatedAt, ...rest }) => rest)
    );

    console.log('Gallery and Pricing imported successfully');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();