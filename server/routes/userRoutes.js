const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Fetch teachers assigned to the logged-in RO
router.get('/ro-dashboard', async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ message: 'RO username is required' });
        }

        // Fetch RO details
        const ro = await User.findOne({ username, role: 'RO' });
        if (!ro) {
            return res.status(404).json({ message: 'RO not found' });
        }

        // Fetch Teachers assigned to this RO
        const teachers = await User.find({ role: 'Teacher', assignedRO: username }, 'name department employeeCode status isReviewClickable image designation');

        res.json({ roDepartment: ro.department, teachers });
    } catch (error) {
        console.error('Error fetching RO details and teachers:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;
