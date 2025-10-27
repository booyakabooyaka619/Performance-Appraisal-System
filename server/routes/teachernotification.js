// routes/teachernotification.js
const express = require("express");
const router = express.Router();
const TeacherNotification = require("../models/TeacherNotification");
const User = require("../models/User"); // to find teacher by employeeCode

// Route to create a notification when RO completes review
router.post("/send", async (req, res) => {
    const { employeeCode } = req.body;

    try {
        const teacher = await User.findOne({ employeeCode, role: "Teacher" });

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const newNotification = new TeacherNotification({
            recipient: teacher.employeeCode, // or teacher._id if you prefer
            message: "Your review has been completed by the RO.",
        });

        await newNotification.save();
        res.status(201).json({ message: "Notification sent successfully" });
    } catch (error) {
        console.error("Notification error:", error);
        res.status(500).json({ message: "Failed to send notification" });
    }
});

// Route to get count of notifications for a specific teacher
// GET /api/teachernotifications/count/:username
// routes/teacherAlerts.js (or wherever your teacher routes are)
router.get('/count', async (req, res) => {
    try {
        const employeeCode = req.query.employeeCode;

        if (!employeeCode) {
            return res.status(400).json({ error: 'Employee code is required' });
        }

        const count = await TeacherNotification.countDocuments({
            recipient: employeeCode,
            $or: [{ isRead: false }, { isRead: { $exists: false } }]
        });

        res.json({ count });
    } catch (error) {
        console.error('Error fetching teacher notification count:', error);
        res.status(500).json({ error: 'Error fetching notification count' });
    }
});






router.put("/mark-read/:id", async (req, res) => {
    try {
        const updated = await TeacherNotification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Not found" });

        res.json({ message: "Marked as read", notification: updated });
    } catch (error) {
        console.error("Error marking read:", error);
        res.status(500).json({ message: "Error updating notification" });
    }
});


// Route to get notifications for a teacher
router.get("/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const notifications = await TeacherNotification.find({ recipient: user.employeeCode }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
});

module.exports = router;
