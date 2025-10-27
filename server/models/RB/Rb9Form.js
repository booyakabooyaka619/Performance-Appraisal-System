const mongoose = require('mongoose');

const Rb9FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },


    technicalContent: { type: String, required: true },
    presentationSkills: { type: String, required: true },
    newTopic: { type: String, required: true },
    literatureSurvey: { type: String, required: true },
    researchAspects: { type: String, required: true },
    audienceInteraction: { type: String, required: true },
    linkEvidence: { type: String, required: true },


    score: { type: Number, required: true },
    formId: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Rb9Form', Rb9FormSchema);
