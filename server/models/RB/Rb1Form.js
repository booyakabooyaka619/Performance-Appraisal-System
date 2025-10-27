const mongoose = require('mongoose');

const Rb1FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },

    conferenceQuality: { type: String, required: true },
    level: { type: String, required: true },
    authorship: { type: String, required: true },
    reviewType: { type: String, required: true },
    presentationType: { type: String, required: true },
    linkEvidence: { type: String, required: true },

    score: { type: Number, required: true },
    formId: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Rb1Form', Rb1FormSchema);
