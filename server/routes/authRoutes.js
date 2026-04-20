/**
 * routes/authRoutes.js
 * --------------------
 * Defines the URL paths for authentication endpoints.
 * Routes connect an HTTP method + URL to a controller function.
 *
 * Registered routes:
 *   POST /api/auth/register  →  authController.register
 *   POST /api/auth/login     →  authController.login
 *
 * What you will add LATER:
 *   - Input validation middleware (e.g., express-validator)
 *   - Rate limiting on /login to prevent brute-force attacks
 *   - A /logout route if using server-side sessions
 */

const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// POST /api/auth/register
// Creates a new user account
router.post("/register", register);

// POST /api/auth/login
// Authenticates a user and returns a token
router.post("/login", login);

module.exports = router;
