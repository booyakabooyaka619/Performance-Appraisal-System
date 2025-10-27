const mongoose = require('mongoose');

const Rb8FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },

    organisingAgency: { type: String, required: true },
    speakerQuality: { type: String, required: true },
    duration: { type: String, required: true },
    modeOfConduct: { type: String, required: true },
    linkEvidence: { type: String, required: true },

    score: { type: Number, required: true },
    formId: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Rb8Form', Rb8FormSchema);
