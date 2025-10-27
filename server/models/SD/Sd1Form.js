const mongoose = require('mongoose');

const Sd1FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    courseName: { type: String, required: true },
    courseAttendance: { type: Number, required: true }, // Changed from String to Number
    linkEvidence: { type: String, required: false },
    score: { type: Number, required: true },
    formId: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Sd1Form', Sd1FormSchema);