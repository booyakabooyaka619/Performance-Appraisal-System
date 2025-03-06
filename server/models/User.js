const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensure that usernames are unique
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Teacher', 'RO'], // Define allowed roles
        required: true,
    },
    name: {
        type: String,
        required: true // Ensure each user has a name
    },
    department: {
        type: String,
        required: true // Ensure each user has a department
    },
    image: {
        type: String, // Store the image as a Base64 string
        required: true // Ensure each user has an image
    },
    employeeCode: {
        type: String,
        required: true,
        unique: true // Ensure that employee codes are unique
    }
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
