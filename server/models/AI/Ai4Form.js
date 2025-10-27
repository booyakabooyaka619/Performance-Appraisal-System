const mongoose = require('mongoose');

const Ai4FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    uploadingVideos: { type: Number, required: true },
    useOfTools: { type: Number, required: true },
    qualityPBStatements: { type: Number, required: true },
    continuousAssessment: { type: Number, required: true },
    mapping: { type: String, required: true },
    linkEvidence: { type: String, required: true },
    formId: { type: String, required: true },
    score: { type: Number, default: 0 },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }  // 🆕 New Field to track review editability 
}, { timestamps: true });

module.exports = mongoose.model('Ai4Form', Ai4FormSchema);
