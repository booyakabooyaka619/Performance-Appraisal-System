const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const ai1FormRoutes = require('./routes/AI/ai1form');
const userRoutes = require('./routes/userRoutes');
const ai2FormRoutes = require('./routes/AI/ai2form');
const ai31FormRoutes = require('./routes/AI/ai31form');
const ai32FormRoutes = require('./routes/AI/ai32form');
const ai33FormRoutes = require('./routes/AI/ai33form');
const ai34FormRoutes = require('./routes/AI/ai34form');
const ai4FormRoutes = require('./routes/AI/ai4form');
const ai5FormRoutes = require('./routes/AI/ai5form');
const ai6FormRoutes = require('./routes/AI/ai6form');
const ai7FormRoutes = require('./routes/AI/ai7form');
const ai8FormRoutes = require('./routes/AI/ai8form');
const ai9FormRoutes = require('./routes/AI/ai9form');
const ai10FormRoutes = require('./routes/AI/ai10form');
const ai11FormRoutes = require('./routes/AI/ai11form');
const ai12FormRoutes = require('./routes/AI/ai12form');
const ai13FormRoutes = require('./routes/AI/ai13form');
const ai14FormRoutes = require('./routes/AI/ai14form');
const progressRoutes = require('./routes/progress'); // ✅ Import progress routes
const submitStatusRoutes = require('./routes/submitStatus'); // ✅ Import the new route
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const teacherNotificationRoutes = require("./routes/teachernotification");
const sd1FormRoutes = require('./routes/SD/sd1form');
const sd2FormRoutes = require('./routes/SD/sd2form');
const sd3FormRoutes = require('./routes/SD/sd3form');
const sd4FormRoutes = require('./routes/SD/sd4form');
const sd5FormRoutes = require('./routes/SD/sd5form');
const ab1FormRoutes = require('./routes/AB/ab1form');
const ab2FormRoutes = require('./routes/AB/ab2form');
const ab3FormRoutes = require('./routes/AB/ab3form');
const ab4FormRoutes = require('./routes/AB/ab4form');
const ab5FormRoutes = require('./routes/AB/ab5form');
const ab6FormRoutes = require('./routes/AB/ab6form');
const ab7FormRoutes = require('./routes/AB/ab7form');
const ab8FormRoutes = require('./routes/AB/ab8form');
const ab9FormRoutes = require('./routes/AB/ab9form');
const rb1FormRoutes = require('./routes/RB/rb1form');
const rb2FormRoutes = require('./routes/RB/rb2form');
const rb3FormRoutes = require('./routes/RB/rb3form');
const rb4FormRoutes = require('./routes/RB/rb4form');
const rb5FormRoutes = require('./routes/RB/rb5form');
const rb6FormRoutes = require('./routes/RB/rb6form');
const rb7FormRoutes = require('./routes/RB/rb7form');
const rb8FormRoutes = require('./routes/RB/rb8form');
const rb9FormRoutes = require('./routes/RB/rb9form');
const rb10FormRoutes = require('./routes/RB/rb10form');
const rb11FormRoutes = require('./routes/RB/rb11form');
const rb12FormRoutes = require('./routes/RB/rb12form');
const cb1FormRoutes = require('./routes/CB/cb1form');
const cb2FormRoutes = require('./routes/CB/cb2form');
const cb3FormRoutes = require('./routes/CB/cb3form');
const pdb1FormRoutes = require('./routes/PDB/pdb1form');
const pdb2FormRoutes = require('./routes/PDB/pdb2form');
const testEmailRoute = require('./routes/testEmail');


require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// ✅ Serve uploaded PDFs as static files
app.use('/uploads', express.static('uploads')); // Now PDFs can be accessed via <server>/uploads/<filename>

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected to the database'))
    .catch(err => console.error('MongoDB connection error:', err));

// ✅ Use the authentication and form routes
app.use('/api', authRoutes);
app.use('/api/ai1form', ai1FormRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai2form', ai2FormRoutes);
app.use('/api/ai31form', ai31FormRoutes);
app.use('/api/ai32form', ai32FormRoutes);
app.use('/api/ai33form', ai33FormRoutes);
app.use('/api/ai34form', ai34FormRoutes);
app.use('/api/ai4form', ai4FormRoutes);
app.use('/api/ai5form', ai5FormRoutes);
app.use('/api/ai6form', ai6FormRoutes);
app.use('/api/ai7form', ai7FormRoutes);
app.use('/api/ai8form', ai8FormRoutes);
app.use('/api/ai9form', ai9FormRoutes);
app.use('/api/ai10form', ai10FormRoutes);
app.use('/api/ai11form', ai11FormRoutes);
app.use('/api/ai12form', ai12FormRoutes);
app.use('/api/ai13form', ai13FormRoutes);
app.use('/api/ai14form', ai14FormRoutes);
app.use('/api/progress', progressRoutes); // ✅ Use progress route
app.use('/api/submitStatus', submitStatusRoutes); // ✅ Register the route
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use("/api/teacher-alerts", teacherNotificationRoutes);
app.use('/api/sd1form', sd1FormRoutes);
app.use('/api/sd2form', sd2FormRoutes);
app.use('/api/sd3form', sd3FormRoutes);
app.use('/api/sd4form', sd4FormRoutes);
app.use('/api/sd5form', sd5FormRoutes);
app.use('/api/ab1form', ab1FormRoutes);
app.use('/api/ab2form', ab2FormRoutes);
app.use('/api/ab3form', ab3FormRoutes);
app.use('/api/ab4form', ab4FormRoutes);
app.use('/api/ab5form', ab5FormRoutes);
app.use('/api/ab6form', ab6FormRoutes);
app.use('/api/ab7form', ab7FormRoutes);
app.use('/api/ab8form', ab8FormRoutes);
app.use('/api/ab9form', ab9FormRoutes);
app.use('/api/rb1form', rb1FormRoutes);
app.use('/api/rb2form', rb2FormRoutes);
app.use('/api/rb3form', rb3FormRoutes);
app.use('/api/rb4form', rb4FormRoutes);
app.use('/api/rb5form', rb5FormRoutes);
app.use('/api/rb6form', rb6FormRoutes);
app.use('/api/rb7form', rb7FormRoutes);
app.use('/api/rb8form', rb8FormRoutes);
app.use('/api/rb9form', rb9FormRoutes);
app.use('/api/rb10form', rb10FormRoutes);
app.use('/api/rb11form', rb11FormRoutes);
app.use('/api/rb12form', rb12FormRoutes);
app.use('/api/cb1form', cb1FormRoutes);
app.use('/api/cb2form', cb2FormRoutes);
app.use('/api/cb3form', cb3FormRoutes);
app.use('/api/pdb1form', pdb1FormRoutes);
app.use('/api/pdb2form', pdb2FormRoutes);
app.use('/api', testEmailRoute);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


