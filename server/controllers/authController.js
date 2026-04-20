/**
 * controllers/authController.js
 * -----------------------------
 * Handles the logic for authentication-related HTTP requests.
 * Controllers receive a request, call the appropriate service, and send a response.
 *
 * What this file does RIGHT NOW:
 *   - Exports placeholder register() and login() functions
 *   - Returns dummy success responses so routes don't crash
 *
 * What you will add LATER:
 *   - Call authService.registerUser() to create a new user in MongoDB
 *   - Call authService.loginUser() to verify credentials with bcrypt
 *   - Generate a JWT token and return it to the client
 *   - Return proper HTTP error codes (400, 401, 409, 500)
 */

const authService = require("../services/authService");

/**
 * register()
 * Handles POST /api/auth/register
 *
 * Expected request body:
 *   { username: string, password: string }
 *
 * What will happen here later:
 *   1. Validate that username and password are present
 *   2. Call authService.registerUser(username, password)
 *   3. Return the new user object (without the password hash)
 */


// const register = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // TODO: Validate input (check for missing fields, password length, etc.)
//     // TODO: Call authService.registerUser(username, password)
//     // TODO: Return the created user and a JWT token

//     // ── Placeholder response ───────────────────────────────────────────────
//     res.status(201).json({
//       message: "register() placeholder — user not really created",
//       receivedData: { username }, // Never echo back the password, even in placeholder!
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * login()
//  * Handles POST /api/auth/login
//  *
//  * Expected request body:
//  *   { username: string, password: string }
//  *
//  * What will happen here later:
//  *   1. Call authService.loginUser(username, password)
//  *   2. If credentials are valid, return a signed JWT token
//  *   3. If invalid, return 401 Unauthorized
//  */
// const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // TODO: Call authService.loginUser(username, password)
//     // TODO: On success, sign and return a JWT token
//     // TODO: On failure, return 401 with a generic error message

//     // ── Placeholder response ───────────────────────────────────────────────
//     res.status(200).json({
//       message: "login() placeholder — not really authenticated",
//       token: "dummy-jwt-token-replace-with-real-one-later",
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = { register, login };




const { registerUser, loginUser } = require('../services/authService');

// @desc    Register new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await registerUser(username, email, password);

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await loginUser(email, password);

    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  register,
  login
};