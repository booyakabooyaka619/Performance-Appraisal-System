const mongoose = require('mongoose');

const Rb2FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },

    quality: { type: String, required: true },
    impactFactor: { type: String, required: true },
    level: { type: String, required: true },
    authorship: { type: String, required: true },
    reviewType: { type: String, required: true },
    availability: { type: String, required: true },
    linkEvidence: { type: String, required: true },

    score: { type: Number, required: true },
    formId: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Rb2Form', Rb2FormSchema);
