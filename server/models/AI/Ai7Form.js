const mongoose = require('mongoose');

const Ai7FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    formId: { type: String, required: true },
    courseName: { type: String, required: true },
    theoryNotes: { type: Number, required: true, min: 0, max: 1 },
    eBook: { type: Number, required: true, min: 0, max: 1 },
    resourceBook: { type: Number, required: true, min: 0, max: 1 },
    aapValidation: { type: Number, required: true, min: 0, max: 1 },
    score: { type: Number, default: 0 },
    linkEvidence: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }  // 🆕 New Field to track review editability 
}, { timestamps: true });

module.exports = mongoose.model('Ai7Form', Ai7FormSchema);
