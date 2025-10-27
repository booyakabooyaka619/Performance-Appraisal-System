// routes/submitStatus.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const sendEmail = require('../routes/sendEmail'); // <- use the email utility
require('dotenv').config(); // <- load env variables

// ✅ Update submission status and send email to assigned RO
router.post('/', async (req, res) => {
    const { name, department, employeeCode } = req.body;

    try {
        // Step 1: Update submission status
        const result = await User.updateOne(
            { name, department, employeeCode, role: 'Teacher' },
            { $set: { status: 'Submitted' } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Teacher not found or already submitted' });
        }

        // Step 2: Get teacher's assigned RO
        const teacher = await User.findOne({ name, department, employeeCode, role: 'Teacher' });
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found after update' });
        }

        const ro = await User.findOne({ username: teacher.assignedRO });
        if (!ro || !ro.email) {
            return res.status(404).json({ error: 'Assigned RO not found or missing email' });
        }

        // Step 3: Send email to RO
        const subject = `Form Submission from ${teacher.name}`;
        const textMessage = `Greetings Sir,\n\n${teacher.name} has submitted their form.`;

        const htmlMessage = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <p style="font-size: 16px;">Greetings Sir,</p>
                <p style="font-size: 16px;"><strong>${teacher.name}</strong> has submitted their form and it is ready for you evaluation.</p>

                <div style="margin-top: 30px; color: grey; font-size: 14px; line-height: 1.4;">
                    <p style="margin: 4px 0;">With Gratitude & Regards,</p>
                    <p style="margin: 4px 0;">PA Team</p>
                    <p style="margin: 4px 0;">Vidyalankar Institute of Technology</p>
                </div>

                <img src="https://drive.google.com/uc?export=view&id=1fikqx2t4Aj8nHKJntiiCPb4QOZlfkuaP" alt="Logo" style="max-width: 550px; display: block; margin-top: 30px;" />
            </div>
        </div>
    `;

        await sendEmail(ro.email, subject, textMessage, htmlMessage);

        res.json({ message: 'Submission successful and email sent to RO' });

    } catch (error) {
        console.error('Error in submission:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ✅ Get submission status
router.get('/', async (req, res) => {
    const { teacherName } = req.query;

    if (!teacherName) {
        return res.status(400).json({ error: "Teacher name is required" });
    }

    try {
        const teacher = await User.findOne({ name: teacherName, role: 'Teacher' });

        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found" });
        }

        res.json({ isSubmitted: teacher.status === 'Submitted' });
    } catch (error) {
        console.error('Error fetching submission status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
