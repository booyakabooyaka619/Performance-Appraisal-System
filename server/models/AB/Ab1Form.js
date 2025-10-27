const mongoose = require('mongoose');

const Ab1FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },

    qualityActivity: { type: String, required: true },
    paperSelectionRatio: { type: String, required: true },
    association: { type: String, required: true },
    designation: { type: String, required: true },
    linkEvidence: { type: String, required: true }, // URL for proof

    score: { type: Number, required: true },
    formId: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Ab1Form', Ab1FormSchema);
