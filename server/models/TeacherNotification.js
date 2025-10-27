// models/TeacherNotification.js
const mongoose = require("mongoose");

const teacherNotificationSchema = new mongoose.Schema({
    recipient: { type: String, required: true }, // use username or employeeCode
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TeacherNotification", teacherNotificationSchema);
