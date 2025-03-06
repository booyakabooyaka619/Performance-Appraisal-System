const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const User = require('./models/User'); // Adjust the path to your User model
require('dotenv').config();

// Function to convert image to Base64
const getImageBase64 = (imagePath) => {
    return fs.readFileSync(imagePath, { encoding: 'base64' });
};

// Function to create a new user if they don't already exist
const createUserIfNotExists = async (userData) => {
    const existingUser = await User.findOne({ username: userData.username });
    if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
        const newUser = new User(userData);
        await newUser.save();
        console.log(`User ${userData.username} created`);
    } else {
        console.log(`User ${userData.username} already exists`);
    }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('MongoDB connected');

        // Teacher users with name, department, image, and employee code
        const teachers = [
            {
                username: 'teacher1',
                password: 'password123',
                role: 'Teacher',
                name: 'John Doe',
                department: 'Mathematics',
                image: getImageBase64(path.join(__dirname, 'images', 'teacher1.jpg')),
                employeeCode: 'VIT001' // Add employee code
            },
            {
                username: 'teacher2',
                password: 'password123',
                role: 'Teacher',
                name: 'Jane Smith',
                department: 'Science',
                image: getImageBase64(path.join(__dirname, 'images', 'teacher2.jpg')),
                employeeCode: 'VIT002' // Add employee code
            },
            {
                username: 'teacher3',
                password: 'password123',
                role: 'Teacher',
                name: 'Michael Johnson',
                department: 'English',
                image: getImageBase64(path.join(__dirname, 'images', 'teacher3.jpg')),
                employeeCode: 'VIT003' // Add employee code
            },
            // Add new teachers here as needed
            {
                username: 'teacher4',
                password: 'password123',
                role: 'Teacher',
                name: 'Alice Brown',
                department: 'History',
                image: getImageBase64(path.join(__dirname, 'images', 'teacher4.jpg')),
                employeeCode: 'VIT004' // Add employee code
            },
            {
                username: 'anushree',
                password: 'anu@2003',
                role: 'Teacher',
                name: 'Anushree Shetty',
                department: 'IT',
                image: getImageBase64(path.join(__dirname, 'images', 'anushree.jpg')),
                employeeCode: 'VIT005' // Add employee code
            },
            {
                username: 'sunpreet',
                password: 'sunny123',
                role: 'Teacher',
                name: 'Sunpreet Singh',
                department: 'Computer Engineering',
                image: getImageBase64(path.join(__dirname, 'images', 'sunpreet.jpg')),
                employeeCode: 'VIT006' // Add employee code
            }
        ];

        // RO user with image and employee code
        const ro = {
            username: 'ro1',
            password: 'password456',
            role: 'RO',
            name: 'Admin RO',
            department: 'Administration',
            image: getImageBase64(path.join(__dirname, 'images', 'ro1.jpg')),
            employeeCode: 'RO001' // Add employee code for RO
        };

        // Insert teachers
        for (const teacher of teachers) {
            await createUserIfNotExists(teacher);
        }

        // Insert RO
        await createUserIfNotExists(ro);

        console.log('User creation process completed');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
