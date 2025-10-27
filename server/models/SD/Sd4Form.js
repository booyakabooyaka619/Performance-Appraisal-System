const mongoose = require('mongoose');

const Sd4FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    courseName: { type: String, required: true },
    feedback: { type: Number, required: true },
    attendance: { type: Number, required: true },
    linkEvidence: { type: String, required: true },
    score: { type: Number, required: true },
    formId: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Sd4Form', Sd4FormSchema);
