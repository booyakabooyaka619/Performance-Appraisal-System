const mongoose = require('mongoose');

const Sd3FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    courseName: { type: String, required: true },
    students100: { type: Number, required: true },
    students90to99: { type: Number, required: true },
    students80to89: { type: Number, required: true },
    students70to79: { type: Number, required: true },
    students60to69: { type: Number, required: true },
    studentsBelow60: { type: Number, required: true },
    linkEvidence: { type: String, required: true },
    score: { type: Number, required: true },
    formId: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Sd3Form', Sd3FormSchema);
