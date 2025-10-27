const mongoose = require('mongoose');

const Ab8FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },

    typeOfMembership: { type: String, required: true },
    positionHeld: { type: String, required: true },
    linkEvidence: { type: String, required: true },

    score: { type: Number, required: true },
    formId: { type: String, required: true }, // ✅ Unique Form Identifier
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Ab8Form', Ab8FormSchema);
