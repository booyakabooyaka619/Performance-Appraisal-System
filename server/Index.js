const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the CORS package
const authRoutes = require('./routes/auth'); // Adjust the path as necessary
const formRoutes = require('./routes/form'); // Import the new form route
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB for authentication and form submissions
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected to the database'))
    .catch(err => console.error('MongoDB connection error:', err));

// Use the authentication routes
app.use('/api', authRoutes); // Existing routes
app.use('/api/form', formRoutes); // Add the new form route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
