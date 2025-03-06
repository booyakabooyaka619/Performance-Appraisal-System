const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Import the Form model from your models folder
const Form = require('../models/Form'); // Ensure this path is correct

// POST route for form submission
router.post('/', async (req, res) => {
    console.log('Received form data:', req.body);

    // Destructure fields
    const { hours, platform, assessmentOutcome, dateOfCertification, link, teacherName, teacherDepartment } = req.body;

    // Check for required fields
    if (!teacherName || !teacherDepartment || !hours || !platform || !assessmentOutcome || !dateOfCertification || !link) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newForm = new Form({
            hours,
            platform,
            assessmentOutcome,
            dateOfCertification,
            link,
            teacherName,
            teacherDepartment
        });

        await newForm.save();
        res.status(201).json({ message: 'Form submitted successfully!' });
    } catch (error) {
        console.error('Error submitting form:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// GET route to check if a submission already exists
router.get('/check-submission', async (req, res) => {
    const { teacherName, teacherDepartment } = req.query; // Get user info from request query

    try {
        const existingSubmission = await Form.findOne({ teacherName, teacherDepartment });
        if (existingSubmission) {
            return res.status(200).json({ submitted: true });
        }
        return res.status(200).json({ submitted: false });
    } catch (error) {
        console.error('Error checking submission:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
