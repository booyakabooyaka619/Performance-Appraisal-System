// server/models/Form.js
const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    hours: { type: String, required: true },
    platform: { type: String, required: true },
    assessmentOutcome: { type: String, required: true },
    dateOfCertification: { type: String, required: true },
    link: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Form', formSchema);
