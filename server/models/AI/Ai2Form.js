const mongoose = require('mongoose');

const Ai2FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    courseLabName: { type: String, required: true },
    lecturesEngaged: { type: String, required: true },
    lecturesSyllabus: { type: String, required: true },
    syllabusCompletion: { type: String, required: true },
    linkEvidence: { type: String, required: true },
    formId: { type: String, required: true },
    score: { type: Number, default: 0 },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }  // 🆕 New Field to track review editability
}, { timestamps: true });

module.exports = mongoose.model('Ai2Form', Ai2FormSchema);
