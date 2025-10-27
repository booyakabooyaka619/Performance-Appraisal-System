const mongoose = require('mongoose');

const Ab4FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },

    speakerCategory: { type: String, required: true },
    eventLevel: { type: String, required: true },
    position: { type: String, required: true },
    duration: { type: String, required: true },
    participation: { type: String, required: true },
    linkEvidence: { type: String, required: true },

    score: { type: Number, required: true },
    formId: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Ab4Form', Ab4FormSchema);
