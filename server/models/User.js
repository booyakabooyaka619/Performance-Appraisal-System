const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['Teacher', 'RO'] },
    name: { type: String, required: true },
    department: { type: String, required: true },
    image: { type: String },
    employeeCode: { type: String, required: true, unique: true },
    email: { type: String, required: true }, // ✅ Added email field
    designation: { type: String, required: true }, // ✅ Added designation field
    assignedRO: {
        type: String,
        required: function () {
            return this.role === 'Teacher'; // Only required for Teachers
        }
    },
    status: { type: String, default: 'Not Submitted' }, // ✅ Keeps track of submission status
    isReviewClickable: { type: Boolean, default: false } // ✅ Allows teacher to view reviews
});

module.exports = mongoose.model('User', userSchema);
