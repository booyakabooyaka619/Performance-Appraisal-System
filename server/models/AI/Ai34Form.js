const mongoose = require('mongoose');

const Ai34FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    typeOfGuide: { type: String, required: true },
    typeOfOrganisation: { type: String, required: true },
    typeOfProject: { type: String, required: true },
    mapping: { type: String, required: true },
    score: { type: Number, default: 0 },
    linkEvidence: { type: String, required: true },
    formId: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }  // 🆕 New Field to track review editability 
}, { timestamps: true });

module.exports = mongoose.model('Ai34Form', Ai34FormSchema);
