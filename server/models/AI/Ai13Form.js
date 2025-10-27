const mongoose = require('mongoose');

const Ai13FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    formId: { type: String, required: true },
    previewGrade: { type: String, required: true }, // A, B, C, below C
    score: { type: Number, default: 0 },
    linkEvidence: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }  // 🆕 New Field to track review editability 
}, { timestamps: true });

module.exports = mongoose.model('Ai13Form', Ai13FormSchema);
