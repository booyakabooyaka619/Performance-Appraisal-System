const mongoose = require('mongoose');

const Ai12FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    formId: { type: String, required: true },
    chiefConductor: { type: Number, default: 0 }, // ✅ No longer required
    capIncharge: { type: Number, default: 0 },
    seniorSupervisor: { type: Number, default: 0 },
    paperSetting: { type: Number, default: 0 },
    paperSolutions: { type: Number, default: 0 },
    vigilanceSquadMember: { type: Number, default: 0 },
    designOfCurriculum: { type: Number, default: 0 },
    invigilation: { type: Number, default: 0 },
    paperAssessmentModeration: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    linkEvidence: { type: String, default: "" }, // ✅ Allows empty string
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }  // 🆕 New Field to track review editability 
}, { timestamps: true });

module.exports = mongoose.model('Ai12Form', Ai12FormSchema);
