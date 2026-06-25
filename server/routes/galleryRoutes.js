const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getGallery, addGalleryItem } = require('../controllers/galleryController');
const { protect, admin } = require('../middleware/auth');

// Multer storage setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  },
});

router.route('/')
  .get(getGallery)
  .post(protect, admin, upload.single('image'), addGalleryItem);

module.exports = router;
