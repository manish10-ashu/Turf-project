const nodemailer = require('nodemailer');

const sendNotificationEmail = async (data) => {
  const { name, email, phone, subject, message } = data;

  // Create transporter (e.g. Gmail or Ethereal for testing)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.ADMIN_EMAIL || 'admin@homegroundturf.com',
    subject: `Homeground Turf Contact: ${subject}`,
    text: `You have received a new inquiry from ${name}.\n\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <h3>New Inquiry Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } else {
    console.log('SMTP unconfigured. Message output below:');
    console.log(mailOptions.text);
  }
};

module.exports = {
  sendNotificationEmail,
};
