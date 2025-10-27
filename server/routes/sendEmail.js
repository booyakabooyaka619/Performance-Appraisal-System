// utils/sendEmail.js

const nodemailer = require('nodemailer');
require('dotenv').config(); // Make sure this is here

const sendEmail = async (to, subject, text, html = null) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"VIT PA Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      ...(html && { html }) // includes html only if it's provided
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
