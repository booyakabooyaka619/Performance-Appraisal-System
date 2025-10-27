const mongoose = require('mongoose');

const Ai5FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    courseLabName: { type: String, required: true },
    attainmentLevel: { type: String, required: true },
    linkEvidence: { type: String, required: true },
    score: { type: Number, default: 0 },
    formId: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }  // 🆕 New Field to track review editability 
}, { timestamps: true });

module.exports = mongoose.model('Ai5Form', Ai5FormSchema);
