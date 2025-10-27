const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Ai1Form = require('../../models/AI/Ai1Form'); // Ensure this path is correct
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// ✅ Multer Storage Setup (Uploads PDFs to 'uploads/' directory)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // ✅ Store PDFs in 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // ✅ Unique filename
    }
});

// ✅ File Filter (Accepts only PDFs)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// ✅ POST route for form submission (with PDF upload)
router.post('/', upload.single('certificate'), async (req, res) => {
    const { hours, platform, assessmentOutcome, dateOfCertification, teacherName, teacherDepartment, score, formId } = req.body;

    if (!teacherName || !teacherDepartment || !hours || !platform || !assessmentOutcome || !dateOfCertification || !formId) {
        return res.status(400).json({ message: 'All fields except certificate are required' });
    }

    const certificateUrl = req.file ? `/uploads/${req.file.filename}` : null; // ✅ Store PDF path

    try {
        const newForm = new Ai1Form({
            hours,
            platform,
            assessmentOutcome,
            dateOfCertification,
            teacherName,
            teacherDepartment,
            score,
            formId,
            certificateUrl
        });

        await newForm.save();
        res.status(201).json({ message: 'Form submitted successfully!', newForm });
    } catch (error) {
        console.error('Error submitting form:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// ✅ GET route to check if a submission already exists
router.get('/check-submission', async (req, res) => {
    const { teacherName, teacherDepartment } = req.query;

    try {
        const existingSubmission = await Ai1Form.findOne({ teacherName, teacherDepartment });
        return res.status(200).json({ submitted: !!existingSubmission });
    } catch (error) {
        console.error('Error checking submission:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// ✅ GET route to fetch all submissions of a logged-in user
router.get('/submissions', async (req, res) => {
    const { teacherName, teacherDepartment, formId } = req.query;

    if (!teacherName || !teacherDepartment || !formId) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const submissions = await Ai1Form.find({ teacherName, teacherDepartment, formId }).sort({ createdAt: -1 });
        return res.status(200).json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// ✅ PUT route to update a submission (including updating certificate)
router.put('/:id', upload.single('certificate'), async (req, res) => {
    const { hours, platform, assessmentOutcome, dateOfCertification, score } = req.body;
    const certificateUrl = req.file ? `/uploads/${req.file.filename}` : undefined; // ✅ Update PDF if provided

    try {
        const updatedForm = await Ai1Form.findByIdAndUpdate(
            req.params.id,
            { hours, platform, assessmentOutcome, dateOfCertification, score, ...(certificateUrl && { certificateUrl }) },
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
        const form = await Ai1Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        // ✅ Check if there is an associated certificate and delete the file
        if (form.certificateUrl) {
            const filePath = path.join(__dirname, '..', form.certificateUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // ✅ Delete the form from the database
        await Ai1Form.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Form and associated certificate deleted successfully!' });
    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.put('/toggle-edit-review/:id', async (req, res) => {
    try {
        const form = await Ai1Form.findById(req.params.id);
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
        const form = await Ai1Form.findById(req.params.id);
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
