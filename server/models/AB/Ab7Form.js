const mongoose = require('mongoose');

const Ab7FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },

    role1: { type: String, required: true },
    role2: { type: String, required: true },
    role3: { type: String, required: true },
    role4: { type: String, required: true },
    linkEvidence: { type: String, required: true },

    score: { type: Number, required: true },
    formId: { type: String, required: true }, // Unique Form Identifier
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Ab7Form', Ab7FormSchema);
