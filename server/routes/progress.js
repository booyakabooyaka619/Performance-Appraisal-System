const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import all Academic Involvement form models
const Ai1Form = require('../models/AI/Ai1Form');
const Ai2Form = require('../models/AI/Ai2Form');
const Ai31Form = require('../models/AI/Ai31Form');
const Ai32Form = require('../models/AI/Ai32Form');
const Ai33Form = require('../models/AI/Ai33Form');
const Ai34Form = require('../models/AI/Ai34Form');
const Ai4Form = require('../models/AI/Ai4Form');
const Ai5Form = require('../models/AI/Ai5Form');
const Ai6Form = require('../models/AI/Ai6Form');
const Ai7Form = require('../models/AI/Ai7Form');
const Ai8Form = require('../models/AI/Ai8Form');
const Ai9Form = require('../models/AI/Ai9Form');
const Ai10Form = require('../models/AI/Ai10Form');
const Ai11Form = require('../models/AI/Ai11Form');
const Ai12Form = require('../models/AI/Ai12Form');
const Ai13Form = require('../models/AI/Ai13Form');
const Ai14Form = require('../models/AI/Ai14Form');

// Academic Involvement forms
const academicForms = [
    Ai1Form, Ai2Form, Ai31Form, Ai32Form, Ai33Form, Ai34Form, Ai4Form,
    Ai5Form, Ai6Form, Ai7Form, Ai8Form, Ai9Form, Ai10Form,
    Ai11Form, Ai12Form, Ai13Form, Ai14Form
];

// Import Student Development form models
const Sd1Form = require('../models/SD/Sd1Form');
const Sd2Form = require('../models/SD/Sd2Form');
const Sd3Form = require('../models/SD/Sd3Form');
const Sd4Form = require('../models/SD/Sd4Form');
const Sd5Form = require('../models/SD/Sd5Form');

// Student Development forms
const studentDevForms = [Sd1Form, Sd2Form, Sd3Form, Sd4Form, Sd5Form];


const Ab1Form = require('../models/AB/Ab1Form');
const Ab2Form = require('../models/AB/Ab2Form');
const Ab3Form = require('../models/AB/Ab3Form');
const Ab4Form = require('../models/AB/Ab4Form');
const Ab5Form = require('../models/AB/Ab5Form');
const Ab6Form = require('../models/AB/Ab6Form');
const Ab7Form = require('../models/AB/Ab7Form');
const Ab8Form = require('../models/AB/Ab8Form');
const Ab9Form = require('../models/AB/Ab9Form');

const adminForms = [
    Ab1Form, Ab2Form, Ab3Form, Ab4Form,
    Ab5Form, Ab6Form, Ab7Form, Ab8Form, Ab9Form
];

const Rb1Form = require('../models/RB/Rb1Form');
const Rb2Form = require('../models/RB/Rb2Form');
const Rb3Form = require('../models/RB/Rb3Form');
const Rb4Form = require('../models/RB/Rb4Form');
const Rb5Form = require('../models/RB/Rb5Form');
const Rb6Form = require('../models/RB/Rb6Form');
const Rb7Form = require('../models/RB/Rb7Form');
const Rb8Form = require('../models/RB/Rb8Form');
const Rb9Form = require('../models/RB/Rb9Form');
const Rb10Form = require('../models/RB/Rb10Form');
const Rb11Form = require('../models/RB/Rb11Form');
const Rb12Form = require('../models/RB/Rb12Form');


const researchForms = [
    Rb1Form, Rb2Form, Rb3Form, Rb4Form,
    Rb5Form, Rb6Form, Rb7Form, Rb8Form,
    Rb9Form, Rb10Form, Rb11Form, Rb12Form
];


const Cb1Form = require('../models/CB/Cb1Form');
const Cb2Form = require('../models/CB/Cb2Form');
const Cb3Form = require('../models/CB/Cb3Form');

const consultForms = [Cb1Form, Cb2Form, Cb3Form]

const Pdb1Form = require('../models/PDB/Pdb1Form');
const Pdb2Form = require('../models/PDB/Pdb2Form');

const prodDevForms = [Pdb1Form, Pdb2Form]


// ✅ GET Route: Fetch Academic Involvement Submission Progress
router.get('/academic-involvement/progress', async (req, res) => {
    try {
        const { teacherName } = req.query;
        if (!teacherName) {
            return res.status(400).json({ message: "Teacher name is required" });
        }

        let submittedCount = 0;

        for (let model of academicForms) {
            const count = await model.countDocuments({ teacherName });
            if (count > 0) submittedCount++;
        }

        const totalForms = 17;
        const progressPercentage = (submittedCount / totalForms) * 100;

        res.status(200).json({
            category: 'Academic Involvement',
            totalForms,
            submittedForms: submittedCount,
            progressPercentage: progressPercentage.toFixed(2),
        });
    } catch (error) {
        console.error("Error fetching academic progress:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// ✅ GET Route: Fetch Student Development Submission Progress
router.get('/student-development/progress', async (req, res) => {
    try {
        const { teacherName } = req.query;
        if (!teacherName) {
            return res.status(400).json({ message: "Teacher name is required" });
        }

        let submittedCount = 0;

        for (let model of studentDevForms) {
            const count = await model.countDocuments({ teacherName });
            if (count > 0) submittedCount++;
        }

        const totalForms = 5;
        const progressPercentage = (submittedCount / totalForms) * 100;

        res.status(200).json({
            category: 'Student Development',
            totalForms,
            submittedForms: submittedCount,
            progressPercentage: progressPercentage.toFixed(2),
        });
    } catch (error) {
        console.error("Error fetching student development progress:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/administrative/progress', async (req, res) => {
    try {
        const { teacherName } = req.query;
        if (!teacherName) {
            return res.status(400).json({ message: "Teacher name is required" });
        }

        let submittedCount = 0;

        for (let model of adminForms) {
            const count = await model.countDocuments({ teacherName });
            if (count > 0) submittedCount++;
        }

        const totalForms = 9;
        const progressPercentage = (submittedCount / totalForms) * 100;

        res.status(200).json({
            category: 'Administrative',
            totalForms,
            submittedForms: submittedCount,
            progressPercentage: progressPercentage.toFixed(2),
        });
    } catch (error) {
        console.error("Error fetching student development progress:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/research/progress', async (req, res) => {
    try {
        const { teacherName } = req.query;
        if (!teacherName) {
            return res.status(400).json({ message: "Teacher name is required" });
        }

        let submittedCount = 0;

        for (let model of researchForms) {
            const count = await model.countDocuments({ teacherName });
            if (count > 0) submittedCount++;
        }

        const totalForms = 12;
        const progressPercentage = (submittedCount / totalForms) * 100;

        res.status(200).json({
            category: 'Research',
            totalForms,
            submittedForms: submittedCount,
            progressPercentage: progressPercentage.toFixed(2),
        });
    } catch (error) {
        console.error("Error fetching student development progress:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/consultancy/progress', async (req, res) => {
    try {
        const { teacherName } = req.query;
        if (!teacherName) {
            return res.status(400).json({ message: "Teacher name is required" });
        }

        let submittedCount = 0;

        for (let model of consultForms) {
            const count = await model.countDocuments({ teacherName });
            if (count > 0) submittedCount++;
        }

        const totalForms = 3;
        const progressPercentage = (submittedCount / totalForms) * 100;

        res.status(200).json({
            category: 'Consultancy',
            totalForms,
            submittedForms: submittedCount,
            progressPercentage: progressPercentage.toFixed(2),
        });
    } catch (error) {
        console.error("Error fetching student development progress:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/product-development/progress', async (req, res) => {
    try {
        const { teacherName } = req.query;
        if (!teacherName) {
            return res.status(400).json({ message: "Teacher name is required" });
        }

        let submittedCount = 0;

        for (let model of prodDevForms) {
            const count = await model.countDocuments({ teacherName });
            if (count > 0) submittedCount++;
        }

        const totalForms = 2;
        const progressPercentage = (submittedCount / totalForms) * 100;

        res.status(200).json({
            category: 'Product Development',
            totalForms,
            submittedForms: submittedCount,
            progressPercentage: progressPercentage.toFixed(2),
        });
    } catch (error) {
        console.error("Error fetching student development progress:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
