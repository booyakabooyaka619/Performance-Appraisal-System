const mongoose = require('mongoose');

const Rb5FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },

    universityQuality: { type: String, required: true },
    qualificationLevel: { type: String, required: true },
    gradeAchieved: { type: String, required: true },
    linkEvidence: { type: String, required: true },

    score: { type: Number, required: true },
    formId: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Rb5Form', Rb5FormSchema);
