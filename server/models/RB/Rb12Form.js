const mongoose = require('mongoose');

const Rb12FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },

    activityType: { type: String, required: true },
    activityLevel: { type: String, required: true },
    linkEvidence: { type: String, required: true },

    score: { type: Number, required: true },
    formId: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Rb12Form', Rb12FormSchema);
