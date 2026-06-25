const Contact = require('../models/Contact');
const { sendNotificationEmail } = require('../utils/emailService');

// @desc    Submit a contact form inquiry
// @route   POST /api/contact
// @access  Public
const submitInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const inquiry = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      isRead: false
    });

    // Send email notification (failsafe so it won't crash if SMTP is unconfigured)
    try {
      await sendNotificationEmail({ name, email, phone, subject, message });
    } catch (err) {
      console.warn('SMTP Email Notification failed (probably unconfigured keys):', err.message);
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry received. We will get back to you shortly!',
      inquiry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitInquiry
};
