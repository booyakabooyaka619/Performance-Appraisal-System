const mongoose = require('mongoose');

const Ai32FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    mouPlacementsType: { type: String, required: true },
    mouPlacements: { type: String, required: true },
    mouInternships: { type: String, required: true },
    facultyPresence: { type: String, required: true },
    internshipsWithIndustry: { type: String, required: true },
    projectsWithIndustry: { type: String, required: true },
    feedbackReceived: { type: Number, required: true },
    numberOfAttendees: { type: Number, required: true },
    numberOfStudents: { type: Number, required: true },
    mapping: { type: String, required: true },
    score: { type: Number, default: 0 },
    linkEvidence: { type: String, required: true },
    formId: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }  // 🆕 New Field to track review editability 
}, { timestamps: true });

module.exports = mongoose.model('Ai32Form', Ai32FormSchema);
