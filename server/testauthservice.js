require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const { registerUser, loginUser } = require('./services/authService');

(async () => {
    try {
        await connectDB();

        // Register
        const user = await registerUser("testuser", "test@example.com", "123456");
        console.log("Registered:", user);

        // Login
        const loggedIn = await loginUser("test@example.com", "123456");
        console.log("Logged In:", loggedIn);

        process.exit();
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
})();