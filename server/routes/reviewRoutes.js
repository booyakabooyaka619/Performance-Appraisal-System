const express = require('express');
const router = express.Router();
const User = require('../models/User');
const sendEmail = require('../routes/sendEmail'); // <- use the email utility
require('dotenv').config(); // <- load env variables

// ✅ API to mark the review as complete
// ✅ API to mark the review as complete and send email to the teacher
router.post('/complete-review', async (req, res) => {
    try {
        const { employeeCode } = req.body;

        const user = await User.findOne({ employeeCode });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the review status
        const result = await User.updateOne(
            { employeeCode },
            { $set: { isReviewClickable: true } }
        );

        if (result.modifiedCount > 0) {
            // Send email to the teacher

            const subject = `Form review completed`;
            const textMessage = `Greetings Sir,\n\n${user.name} has submitted the review of your form.`;

            const htmlMessage = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
              <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <p style="font-size: 16px;">Greetings Professor <strong>${user.name}</strong>,</p>
                <p style="font-size: 16px;">Your form review has been submitted by your RO and the scores are available on your portal.</p>
                
                <div style="margin-top: 30px; color: grey; font-size: 14px; line-height: 1.4;">
                  <p style="margin: 4px 0;">With Gratitude & Regards,</p>
                  <p style="margin: 4px 0;">PA Team</p>
                  <p style="margin: 4px 0;">Vidyalankar Institute of Technology</p>
                </div>
          
                <img src="https://drive.google.com/uc?export=view&id=1fikqx2t4Aj8nHKJntiiCPb4QOZlfkuaP" alt="Logo" style="max-width: 550px; display: block; margin-top: 30px;" />
              </div>
            </div>
          `;



            await sendEmail(user.email, subject, textMessage, htmlMessage);


            return res.status(200).json({ message: 'Review marked as complete and email sent' });
        } else {
            return res.status(400).json({ message: 'Review already completed or user not updated' });
        }
    } catch (error) {
        console.error('Error completing review:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


// ✅ API to fetch review status for a teacher
router.get('/teacher-review-status/:employeeCode', async (req, res) => {
    try {
        const { employeeCode } = req.params;
        const user = await User.findOne({ employeeCode });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ isReviewClickable: user.isReviewClickable });
    } catch (error) {
        console.error("Error fetching review status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/check-status', async (req, res) => {
    const { employeeCode } = req.body;

    try {
        const user = await User.findOne({ employeeCode });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if review was already submitted
        if (user.isReviewClickable === true) {
            return res.json({ reviewCompleted: true });
        }

        return res.json({ reviewCompleted: false });
    } catch (error) {
        console.error('Error checking status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
