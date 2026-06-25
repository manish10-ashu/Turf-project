const Gallery = require('../models/Gallery');

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
const getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find({}).sort({ order: 1 });
    res.json({ success: true, gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a gallery image (Admin)
// @route   POST /api/gallery
// @access  Private/Admin
const addGalleryItem = async (req, res) => {
  try {
    const { title, category, order, imageUrl } = req.body;
    
    // Support either direct imageUrl or file upload path
    let finalImageUrl = imageUrl;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    if (!finalImageUrl) {
      return res.status(400).json({ success: false, message: 'Please provide an image url or file' });
    }

    const galleryItem = await Gallery.create({
      title,
      category,
      order: order || 0,
      imageUrl: finalImageUrl
    });

    res.status(201).json({ success: true, galleryItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGallery,
  addGalleryItem
};
