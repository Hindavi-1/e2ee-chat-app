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

/**/


const User = require('../models/User');
const { hashPassword, comparePassword } = require('../crypto/hash');
const { signToken } = require('../crypto/jwt');

// Register new user
const registerUser = async (username, email, password, publicKey) => {
  // 1. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // 2. Hash password
  const hashedPassword = await hashPassword(password);

  // 3. Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    publicKey: publicKey || ''
  });

  // 4. Generate token
  const token = signToken(user._id);

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    token
  };
};

// Login user
const loginUser = async (email, password, publicKey) => {
  // 1. Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // 2. Compare password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // 3. Update public key if provided
  if (publicKey) {
    user.publicKey = publicKey;
    await user.save();
  }

  // 3. Generate token
  const token = signToken(user._id);

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    token
  };
};

module.exports = {
  registerUser,
  loginUser
};


