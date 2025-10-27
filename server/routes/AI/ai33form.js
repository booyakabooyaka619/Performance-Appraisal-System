const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Ai33Form = require('../../models/AI/Ai33Form'); // Ensure correct model path

// ✅ POST route for AI3.3 form submission
router.post('/', async (req, res) => {
    const { teacherName, teacherDepartment, typeOfEvent, awardsReceived, feedbackReceived, numberOfAttendees, numberOfStudents, mapping, linkEvidence, formId, score } = req.body;

    if (!teacherName || !teacherDepartment || !typeOfEvent || !awardsReceived || !feedbackReceived || !numberOfAttendees || !numberOfStudents || !mapping || !linkEvidence || !formId) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newForm = new Ai33Form({
            teacherName,
            teacherDepartment,
            typeOfEvent,
            awardsReceived,
            feedbackReceived,
            numberOfAttendees,
            numberOfStudents,
            mapping,
            linkEvidence,
            formId,
            score: score || 0
        });

        await newForm.save();
        res.status(201).json({ message: 'AI3.3 Form submitted successfully!', newForm });
    } catch (error) {
        console.error('Error submitting AI3.3 form:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// ✅ GET route to fetch all AI3.3 submissions
router.get('/submissions', async (req, res) => {
    const { teacherName, teacherDepartment, formId } = req.query;

    if (!teacherName || !teacherDepartment || !formId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const submissions = await Ai33Form.find({ teacherName, teacherDepartment, formId }).sort({ createdAt: -1 });
        return res.status(200).json(submissions);
    } catch (error) {
        console.error('Error fetching AI3.3 submissions:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// ✅ GET route to check if a submission exists
router.get('/check-submission', async (req, res) => {
    const { teacherName, teacherDepartment } = req.query;

    try {
        const existingSubmission = await Ai33Form.findOne({ teacherName, teacherDepartment });
        return res.status(200).json({ submitted: !!existingSubmission });
    } catch (error) {
        console.error('Error checking submission:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// ✅ PUT route to update an existing AI3.3 submission
router.put('/:id', async (req, res) => {
    const { typeOfEvent, awardsReceived, feedbackReceived, numberOfAttendees, numberOfStudents, mapping, linkEvidence, score } = req.body;

    if (!typeOfEvent || !awardsReceived || !feedbackReceived || !numberOfAttendees || !numberOfStudents || !mapping || !linkEvidence) {
        return res.status(400).json({ message: 'All fields are required to update the form' });
    }

    try {
        const updatedForm = await Ai33Form.findByIdAndUpdate(
            req.params.id,
            { typeOfEvent, awardsReceived, feedbackReceived, numberOfAttendees, numberOfStudents, mapping, linkEvidence, score },
            { new: true }
        );

        if (!updatedForm) {
            return res.status(404).json({ message: 'Form not found' });
        }

        res.status(200).json({ message: 'Form updated successfully!', updatedForm });
    } catch (error) {
        console.error('Error updating form:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// ✅ DELETE route to remove a submission by ID
router.delete('/:id', async (req, res) => {
    try {
        const form = await Ai33Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        await Ai33Form.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Form deleted successfully!' });
    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.put('/toggle-edit-review/:id', async (req, res) => {
    try {
        const form = await Ai33Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        // Toggle the edit mode
        form.isReviewEditable = !form.isReviewEditable;
        await form.save();

        res.status(200).json({ message: `Review edit mode ${form.isReviewEditable ? 'enabled' : 'disabled'}`, form });
    } catch (error) {
        console.error('Error toggling review edit mode:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


// ✅ PUT route to update Score by RO and Review by RO
router.put('/submit-review/:id', async (req, res) => {
    const { scoreByRO, reviewByRO } = req.body;

    if (scoreByRO === undefined || !reviewByRO) {
        return res.status(400).json({ message: 'Both Score by RO and Review by RO are required' });
    }

    try {
        const form = await Ai33Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        // ✅ Allow submission even if review was not editable
        form.scoreByRO = scoreByRO;
        form.reviewByRO = reviewByRO;
        form.isReviewEditable = false; // Lock editing after submission
        await form.save();

        res.status(200).json({ message: 'Review submitted successfully and locked!', form });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


module.exports = router;
