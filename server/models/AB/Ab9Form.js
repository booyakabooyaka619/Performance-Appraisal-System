const mongoose = require('mongoose');

const Ab9FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },

    instituteAward: { type: Number, required: true },
    radioTVPrograms: { type: Number, required: true },
    individualAward: { type: Number, required: true },
    expertTalks: { type: Number, required: true },
    careerCounseling: { type: Number, required: true },
    eminentGuests: { type: Number, required: true },
    otherWork: { type: Number, required: true },
    linkEvidence: { type: String, required: true }, // ✅ Now a string

    score: { type: Number, required: true },
    formId: { type: String, required: true }, // ✅ Unique Form Identifier
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Ab9Form', Ab9FormSchema);
