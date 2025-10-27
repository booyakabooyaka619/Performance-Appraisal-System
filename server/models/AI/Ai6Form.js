const mongoose = require('mongoose');

const Ai6FormSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    teacherDepartment: { type: String, required: true },
    numStudentsInnovativeTLP: { type: Number, required: true }, // No. of students participating in all innovative TLP activities
    numStudentsEnrollment: { type: Number, required: true }, // No. of students enrollment for the course
    qualityAssignments: { type: Number, required: true }, // Quality of Assignments
    qualityQuizzes: { type: Number, required: true }, // Quality of Quizzes/Tests
    qualityExperiment: { type: Number, required: true }, // Quality of experiment conducted in practical
    engagementActivities: { type: Number, required: true }, // Activities done for engagement with students outside the classroom
    slowLearnerActivities: { type: Number, required: true }, // Activities done for Slow Learners
    advanceLearnerActivities: { type: Number, required: true }, // Activities done for Advance Learners
    numAssessmentActivities: { type: Number, required: true }, // No. of activities
    mapping: { type: String, required: true }, // Mapping (dropdown)
    linkEvidence: { type: String, required: true }, // Evidence Link
    score: { type: Number, default: 0 },
    formId: { type: String, required: true }, // Unique form identifier
    scoreByRO: { type: Number, default: null },
    reviewByRO: { type: String, default: '' },
    isReviewEditable: { type: Boolean, default: false }  // 🆕 New Field to track review editability 
}, { timestamps: true });

module.exports = mongoose.model('Ai6Form', Ai6FormSchema);
