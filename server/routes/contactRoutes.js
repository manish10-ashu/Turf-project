const express = require('express');
const router = express.Router();
const { submitInquiry } = require('../controllers/contactController');
const { validateContact } = require('../utils/validators');

router.post('/', validateContact, submitInquiry);

module.exports = router;
