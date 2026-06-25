const Pricing = require('../models/Pricing');

// @desc    Get all pricing slots
// @route   GET /api/pricing
// @access  Public
const getPricing = async (req, res) => {
  try {
    const pricing = await Pricing.find({}).sort({ timeSlot: 1 });
    res.json({ success: true, pricing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create/Update pricing slots (Admin)
// @route   POST /api/pricing
// @access  Private/Admin
const updatePricing = async (req, res) => {
  try {
    const { timeSlot, weekdayPrice, weekendPrice, isPopular, sport,isAvailable } = req.body;
   
    let pricing = await Pricing.findOne({ timeSlot });

    if (pricing) {
      pricing.weekdayPrice = weekdayPrice !== undefined ? weekdayPrice : pricing.weekdayPrice;
      pricing.weekendPrice = weekendPrice !== undefined ? weekendPrice : pricing.weekendPrice;
      pricing.isPopular = isPopular !== undefined ? isPopular : pricing.isPopular;
      pricing.sport = sport !== undefined ? sport : pricing.sport;
      pricing.isAvailable =
      isAvailable !== undefined
      ? isAvailable: pricing.isAvailable;
      
      await pricing.save();
    } else {
      pricing = await Pricing.create({
        timeSlot,
        weekdayPrice,
        weekendPrice,
        isPopular,
        sport,
         isAvailable
      });
    }

    res.json({ success: true, pricing });
  } catch (error) {
      console.error("UPDATE PRICING ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPricing,
  updatePricing
};
