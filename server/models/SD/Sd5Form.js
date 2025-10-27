const mongoose = require('mongoose');

const Sd5FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    noOfMeetings: { type: String, required: true },
    awardsWon: { type: String, required: true },
    menteeDevelopment: { type: String, required: true },
    finalYearFeedback: { type: String, required: true },
    linkEvidence: { type: String, required: true },
    score: { type: Number, required: true },
    formId: { type: String, required: true },
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Sd5Form', Sd5FormSchema);
