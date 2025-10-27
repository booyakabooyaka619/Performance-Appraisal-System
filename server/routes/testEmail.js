const express = require('express');
const router = express.Router();
const sendEmail = require('./sendEmail'); // adjust path if needed

router.get('/testEmail', async (req, res) => {
    try {
        await sendEmail({
            to: 'yourpersonalemail@gmail.com',  // change this to your own email
            subject: 'Test Email',
            text: 'This is a test email from your backend using nodemailer.',
        });
        res.status(200).json({ message: 'Test email sent successfully!' });
    } catch (error) {
        console.error("Test email error:", error);
        res.status(500).json({ error: 'Failed to send test email.' });
    }
});

module.exports = router;
