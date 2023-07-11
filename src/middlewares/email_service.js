const nodemailer = require('nodemailer');

// Create a transporter using your email provider or SMTP server details
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'thekusangi007@gmail.com',
    pass: 'thekusangi007',
  },
});

// Email sending middleware
const sendEmail = async (req, res, next) => {
  try {
    // const { email, resetToken } = req.emailData;
  console.log('emailer')
    const mailOptions = {
      from: 'thekusangi007@gmail.com',
      to: 'saikumarkusangi007@gmail.com',
      subject: 'Password Reset',
      text: `You have requested to reset your password. Please click the following link to reset your password:}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log('Password reset email sent');

    next();
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    res.status(500).json({ error: 'Failed to send password reset email' });
  }
};

module.exports = { sendEmail };
