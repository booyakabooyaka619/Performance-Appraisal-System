const mongoose = require('mongoose');

const Ai11FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    formId: { type: String, required: true },
    natureOfProblemStatement: { type: String, required: true },
    participationInCompetitions: { type: String, required: true }, // Changed to String
    awards: { type: String, required: true }, // Changed to String
    publications: { type: String, required: true }, // Changed to String
    fundingReceived: { type: String, required: true }, // Changed to String
    qualityOfUniversity: { type: String, required: true },
    score: { type: Number, default: 0 },
    linkEvidence: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }  // 🆕 New Field to track review editability 
}, { timestamps: true });

module.exports = mongoose.model('Ai11Form', Ai11FormSchema);
