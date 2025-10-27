const mongoose = require('mongoose');

const Ai31FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    qualityOfSpeaker: { type: String, required: true },
    feedbackReceived: { type: Number, required: true },
    numberOfAttendees: { type: Number, required: true },
    numberOfStudents: { type: Number, required: true },
    mapping: { type: String, required: true },
    score: { type: Number, default: 0 },
    linkEvidence: { type: String, required: true },
    formId: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }  // 🆕 New Field to track review editability 
}, { timestamps: true });

module.exports = mongoose.model('Ai31Form', Ai31FormSchema);



