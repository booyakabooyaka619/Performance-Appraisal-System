const mongoose = require('mongoose');

const Ai1FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    hours: { type: String, required: true },
    platform: { type: String, required: true },
    assessmentOutcome: { type: String, required: true },
    dateOfCertification: { type: String, required: true },
    certificateUrl: { type: String, required: false }, // ✅ Stores the PDF URL instead of link
    score: { type: Number, required: true },
    formId: { type: String, required: true }, // ✅ Unique Form Identifier
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }  // 🆕 New Field to track review editability 
}, { timestamps: true });

module.exports = mongoose.model('Ai1Form', Ai1FormSchema);
