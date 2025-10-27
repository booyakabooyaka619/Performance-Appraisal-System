const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User'); // Import User model to fetch assigned RO


// Fetch unread notification count
router.get('/count', async (req, res) => {
    try {
        const roUsername = req.query.roUsername;
        if (!roUsername) {
            return res.status(400).json({ error: 'RO username is required' });
        }

        const count = await Notification.countDocuments({ isRead: false, assignedRO: roUsername });

        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notification count' });
    }
});

// Fetch all notifications
router.get('/', async (req, res) => {
    try {
        const roUsername = req.query.roUsername; // Get RO's username from request

        if (!roUsername) {
            return res.status(400).json({ error: 'RO username is required' });
        }

        // Fetch only notifications assigned to this RO
        const notifications = await Notification.find({ assignedRO: roUsername }).sort({ createdAt: -1 });

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notifications' });
    }
});


// Mark notification as read
router.put('/:id/read', async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating notification' });
    }
});

// Add a new notification (when teacher submits)
router.post('/new', async (req, res) => {
    try {
        const { message, teacherUsername } = req.body;

        const teacher = await User.findOne({ username: teacherUsername });
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        if (!teacher.assignedRO) {
            return res.status(400).json({ error: 'No RO assigned to this teacher' });
        }

        const newNotification = new Notification({
            message,
            assignedRO: teacher.assignedRO,
        });

        await newNotification.save();
        res.status(201).json({ message: 'Notification created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating notification' });
    }
});


module.exports = router;
