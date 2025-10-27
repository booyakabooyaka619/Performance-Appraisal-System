const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Rb10Form = require('../../models/RB/Rb10Form'); // ✅ Make sure this path is correct

// ✅ POST route for RB10 form submission
router.post('/', async (req, res) => {
    const { teacherName, teacherDepartment, typeOfInteraction, typeOfPartner, linkEvidence, formId, score } = req.body;

    if (!teacherName || !teacherDepartment || !typeOfInteraction || !typeOfPartner || !linkEvidence || !formId) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newForm = new Rb10Form({
            teacherName,
            teacherDepartment,
            typeOfInteraction,
            typeOfPartner,
            linkEvidence,
            formId,
            score: score || 0
        });

        await newForm.save();
        res.status(201).json({ message: 'RB10 Form submitted successfully!', newForm });
    } catch (error) {
        console.error('Error submitting RB10 form:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// ✅ GET route to fetch all RB10 submissions
router.get('/submissions', async (req, res) => {
    const { teacherName, teacherDepartment, formId } = req.query;

    if (!teacherName || !teacherDepartment || !formId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const submissions = await Rb10Form.find({ teacherName, teacherDepartment, formId }).sort({ createdAt: -1 });
        return res.status(200).json(submissions);
    } catch (error) {
        console.error('Error fetching RB10 submissions:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// ✅ GET route to check if a submission exists
router.get('/check-submission', async (req, res) => {
    const { teacherName, teacherDepartment } = req.query;

    try {
        const existingSubmission = await Rb10Form.findOne({ teacherName, teacherDepartment });
        return res.status(200).json({ submitted: !!existingSubmission });
    } catch (error) {
        console.error('Error checking submission:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// ✅ PUT route to update an existing RB10 submission
router.put('/:id', async (req, res) => {
    const { typeOfInteraction, typeOfPartner, linkEvidence, score } = req.body;

    if (!typeOfInteraction || !typeOfPartner || !linkEvidence) {
        return res.status(400).json({ message: 'All fields are required to update the form' });
    }

    try {
        const updatedForm = await Rb10Form.findByIdAndUpdate(
            req.params.id,
            { typeOfInteraction, typeOfPartner, linkEvidence, score },
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
        const form = await Rb10Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        await Rb10Form.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Form deleted successfully!' });
    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// ✅ PUT route to toggle edit mode by RO
router.put('/toggle-edit-review/:id', async (req, res) => {
    try {
        const form = await Rb10Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        form.isReviewEditable = !form.isReviewEditable;
        await form.save();

        res.status(200).json({ message: `Review edit mode ${form.isReviewEditable ? 'enabled' : 'disabled'}`, form });
    } catch (error) {
        console.error('Error toggling review edit mode:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// ✅ PUT route to submit review by RO
router.put('/submit-review/:id', async (req, res) => {
    const { scoreByRO, reviewByRO } = req.body;

    if (scoreByRO === undefined || !reviewByRO) {
        return res.status(400).json({ message: 'Both Score by RO and Review by RO are required' });
    }

    try {
        const form = await Rb10Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        form.scoreByRO = scoreByRO;
        form.reviewByRO = reviewByRO;
        form.isReviewEditable = false;
        await form.save();

        res.status(200).json({ message: 'Review submitted successfully and locked!', form });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
