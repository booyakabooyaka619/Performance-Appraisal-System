const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Sd3Form = require('../../models/SD/Sd3Form'); // adjust the path based on your file structure

// ✅ POST route for SD3 form submission
router.post('/', async (req, res) => {
    const {
        teacherName,
        teacherDepartment,
        courseName,
        students100,
        students90to99,
        students80to89,
        students70to79,
        students60to69,
        studentsBelow60,
        linkEvidence,
        formId,
        score
    } = req.body;

    if (!teacherName || !teacherDepartment || !courseName || !formId) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    try {
        const newForm = new Sd3Form({
            teacherName,
            teacherDepartment,
            courseName,
            students100,
            students90to99,
            students80to89,
            students70to79,
            students60to69,
            studentsBelow60,
            linkEvidence,
            formId,
            score: score || 0
        });

        await newForm.save();
        res.status(201).json({ message: 'SD3 Form submitted successfully!', newForm });
    } catch (error) {
        console.error('Error submitting SD3 form:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// ✅ GET route to fetch all SD3 submissions
router.get('/submissions', async (req, res) => {
    const { teacherName, teacherDepartment, formId } = req.query;

    if (!teacherName || !teacherDepartment || !formId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const submissions = await Sd3Form.find({ teacherName, teacherDepartment, formId }).sort({ createdAt: -1 });
        return res.status(200).json(submissions);
    } catch (error) {
        console.error('Error fetching SD3 submissions:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// ✅ GET route to check if a submission exists
router.get('/check-submission', async (req, res) => {
    const { teacherName, teacherDepartment } = req.query;

    try {
        const existingSubmission = await Sd3Form.findOne({ teacherName, teacherDepartment });
        return res.status(200).json({ submitted: !!existingSubmission });
    } catch (error) {
        console.error('Error checking submission:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// ✅ PUT route to update an existing SD3 submission
router.put('/:id', async (req, res) => {
    const {
        courseName,
        students100,
        students90to99,
        students80to89,
        students70to79,
        students60to69,
        studentsBelow60,
        linkEvidence,
        score
    } = req.body;

    if (!courseName) {
        return res.status(400).json({ message: 'Course name is required to update the form' });
    }

    try {
        const updatedForm = await Sd3Form.findByIdAndUpdate(
            req.params.id,
            {
                courseName,
                students100,
                students90to99,
                students80to89,
                students70to79,
                students60to69,
                studentsBelow60,
                linkEvidence,
                score
            },
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
        const form = await Sd3Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        await Sd3Form.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Form deleted successfully!' });
    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// ✅ Toggle review edit mode
router.put('/toggle-edit-review/:id', async (req, res) => {
    try {
        const form = await Sd3Form.findById(req.params.id);
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

// ✅ PUT route to update Score by RO and Review by RO
router.put('/submit-review/:id', async (req, res) => {
    const { scoreByRO, reviewByRO } = req.body;

    if (scoreByRO === undefined || !reviewByRO) {
        return res.status(400).json({ message: 'Both Score by RO and Review by RO are required' });
    }

    try {
        const form = await Sd3Form.findById(req.params.id);
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
