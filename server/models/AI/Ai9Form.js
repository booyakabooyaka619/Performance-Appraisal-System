const mongoose = require('mongoose');

const Ai9FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    formId: { type: String, required: true },
    numberOfProjects: { type: String, required: true }, // Changed to String
    industryProjects: { type: String, required: true }, // Changed to String
    liveProjects: { type: String, required: true }, // Changed to String
    participationInCompetitions: { type: String, required: true }, // Changed to String
    awards: { type: String, required: true }, // Changed to String
    publications: { type: String, required: true }, // Changed to String
    fundingReceived: { type: String, required: true }, // Changed to String
    score: { type: Number, default: 0 },
    linkEvidence: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }  // 🆕 New Field to track review editability 
}, { timestamps: true });

module.exports = mongoose.model('Ai9Form', Ai9FormSchema);
