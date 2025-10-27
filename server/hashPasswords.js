const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path if necessary

// Connect to MongoDB
mongoose.connect('mongodb+srv://sunpreethora:W6xDlKelSxWUKXZL@cluster0.llbkm.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const hashExistingPasswords = async () => {
    try {
        const users = await User.find({}); // Fetch all users

        for (let user of users) {
            if (!user.password.startsWith("$2b$")) { // If password is not already hashed
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await User.updateOne({ _id: user._id }, { password: hashedPassword });
                console.log(`Password updated for ${user.username}`);
            }
        }

        console.log("All passwords hashed successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("Error updating passwords:", error);
        mongoose.connection.close();
    }
};

// Run the function
hashExistingPasswords();
