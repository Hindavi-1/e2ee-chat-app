/**
 * services/authService.js
 * ------------------------
 * Business logic for user registration and login.
 * Services handle the "how" of an operation, keeping controllers thin.
 *
 * What this file does RIGHT NOW:
 *   - Exports placeholder functions that return dummy data
 *
 * What you will add LATER:
 *   - Import the User model from models/User.js
 *   - Use bcrypt (from crypto/hash.js) to hash passwords before saving
 *   - Use JWT helper (from crypto/jwt.js) to generate tokens on login
 *   - Throw meaningful errors for duplicate users, wrong passwords, etc.
 */

/**
 * registerUser()
 * Creates a new user account.
 *
 * @param {string} username - Desired username
 * @param {string} password - Plaintext password (will be hashed here later)
 * @returns {object}        - The new user object (without the password hash)
 */
const registerUser = async (username, password) => {
  // TODO: Check if a user with this username already exists in MongoDB
  // TODO: Hash the password → const hashedPassword = await hashHelper.hash(password);
  // TODO: Create and save a new User document
  // TODO: Return the user (omit the password field)

  console.log(`[authService] registerUser() placeholder called for: ${username}`);

  return {
    id: "placeholder-user-id",
    username,
    // password is intentionally omitted from the return value
  };
};

/**
 * loginUser()
 * Verifies credentials and returns authentication data.
 *
 * @param {string} username - The user's username
 * @param {string} password - The plaintext password to verify
 * @returns {object}        - { user, token } if valid
 */
const loginUser = async (username, password) => {
  // TODO: Find the user in MongoDB by username
  // TODO: Compare password with stored hash → await hashHelper.compare(password, user.password)
  // TODO: If match, sign a JWT → const token = jwtHelper.signToken(user._id)
  // TODO: Return { user, token }

  console.log(`[authService] loginUser() placeholder called for: ${username}`);

  return {
    user: { id: "placeholder-user-id", username },
    token: "placeholder-jwt-token",
  };
};

module.exports = { registerUser, loginUser };
