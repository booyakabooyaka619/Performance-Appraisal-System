const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path as necessary
const router = express.Router();

let serverSessionActive = true; // Variable to track server session state

// Check session status route
router.get('/check-session', (req, res) => {
    res.json({ sessionActive: serverSessionActive });
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Check if the server session is active
        if (!serverSessionActive) {
            return res.status(401).json({ message: 'Session expired, please log in again' });
        }

        // Find user by username and role
        const user = await User.findOne({ username, role });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials or role' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If successful, send user data (excluding password)
        res.json({
            username: user.username,
            role: user.role,
            name: user.name,
            department: user.department,
            image: user.image, // Send the base64 image string
            employeeCode: user.employeeCode // Send the employee code
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Export the router
module.exports = router;

// Listen for the server shutdown event to deactivate the session
process.on('SIGTERM', () => {
    console.log('Server shutting down...');
    serverSessionActive = false; // Mark session as inactive on server shutdown
});
