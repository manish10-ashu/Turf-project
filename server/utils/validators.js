const { check, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const validateRegister = [
  check('name', 'Name is required').not().isEmpty().trim(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('phone', 'Phone number is required').not().isEmpty().trim(),
  handleValidationErrors,
];

const validateLogin = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').exists(),
  handleValidationErrors,
];

const validateBooking = [
  check('date', 'Please include a valid date (YYYY-MM-DD)').isDate({ format: 'YYYY-MM-DD' }),
  check('timeSlot', 'Time slot is required').not().isEmpty().trim(),
  check('players', 'Players count must be at least 1').isInt({ min: 1 }),
  check('sport', 'Sport must be Football or Cricket').isIn(['Football', 'Cricket']),
  check('totalPrice', 'Total price must be a positive number').isFloat({ min: 0 }),
  handleValidationErrors,
];

const validateReview = [
  check('name', 'Name is required').not().isEmpty().trim(),
  check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
  check('comment', 'Comment is required').not().isEmpty().trim(),
  handleValidationErrors,
];

const validateContact = [
  check('name', 'Name is required').not().isEmpty().trim(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('phone', 'Phone number is required').not().isEmpty().trim(),
  check('subject', 'Subject is required').not().isEmpty().trim(),
  check('message', 'Message is required').not().isEmpty().trim(),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateBooking,
  validateReview,
  validateContact,
};
