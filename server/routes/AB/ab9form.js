const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Ab9Form = require('../../models/AB/Ab9Form'); // Adjust path as needed

// ✅ POST route for AB9 form submission
router.post('/', async (req, res) => {
    const {
        teacherName,
        teacherDepartment,
        instituteAward,
        radioTVPrograms,
        individualAward,
        expertTalks,
        careerCounseling,
        eminentGuests,
        otherWork,
        linkEvidence,
        formId,
        score
    } = req.body;

    if (
        !teacherName ||
        !teacherDepartment ||
        !instituteAward ||
        !radioTVPrograms ||
        !individualAward ||
        !expertTalks ||
        !careerCounseling ||
        !eminentGuests ||
        !otherWork ||
        !linkEvidence ||
        !formId
    ) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newForm = new Ab9Form({
            teacherName,
            teacherDepartment,
            instituteAward,
            radioTVPrograms,
            individualAward,
            expertTalks,
            careerCounseling,
            eminentGuests,
            otherWork,
            linkEvidence,
            formId,
            score: score || 0
        });

        await newForm.save();
        res.status(201).json({ message: 'AB9 Form submitted successfully!', newForm });
    } catch (error) {
        console.error('Error submitting AB9 form:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// ✅ GET route to fetch all AB9 submissions
router.get('/submissions', async (req, res) => {
    const { teacherName, teacherDepartment, formId } = req.query;

    if (!teacherName || !teacherDepartment || !formId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const submissions = await Ab9Form.find({ teacherName, teacherDepartment, formId }).sort({ createdAt: -1 });
        return res.status(200).json(submissions);
    } catch (error) {
        console.error('Error fetching AB9 submissions:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// ✅ GET route to check if a submission exists
router.get('/check-submission', async (req, res) => {
    const { teacherName, teacherDepartment } = req.query;

    try {
        const existingSubmission = await Ab9Form.findOne({ teacherName, teacherDepartment });
        return res.status(200).json({ submitted: !!existingSubmission });
    } catch (error) {
        console.error('Error checking submission:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// ✅ PUT route to update an existing AB9 submission
router.put('/:id', async (req, res) => {
    const {
        instituteAward,
        radioTVPrograms,
        individualAward,
        expertTalks,
        careerCounseling,
        eminentGuests,
        otherWork,
        linkEvidence,
        score
    } = req.body;

    if (
        !instituteAward ||
        !radioTVPrograms ||
        !individualAward ||
        !expertTalks ||
        !careerCounseling ||
        !eminentGuests ||
        !otherWork ||
        !linkEvidence
    ) {
        return res.status(400).json({ message: 'All fields are required to update the form' });
    }

    try {
        const updatedForm = await Ab9Form.findByIdAndUpdate(
            req.params.id,
            {
                instituteAward,
                radioTVPrograms,
                individualAward,
                expertTalks,
                careerCounseling,
                eminentGuests,
                otherWork,
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
        const form = await Ab9Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        await Ab9Form.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Form deleted successfully!' });
    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// ✅ Toggle edit mode for RO
router.put('/toggle-edit-review/:id', async (req, res) => {
    try {
        const form = await Ab9Form.findById(req.params.id);
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

// ✅ Submit review by RO
router.put('/submit-review/:id', async (req, res) => {
    const { scoreByRO, reviewByRO } = req.body;

    if (scoreByRO === undefined || !reviewByRO) {
        return res.status(400).json({ message: 'Both Score by RO and Review by RO are required' });
    }

    try {
        const form = await Ab9Form.findById(req.params.id);
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
