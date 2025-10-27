const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    assignedRO: { type: String, required: true }, // 👈 Add assigned RO field
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
