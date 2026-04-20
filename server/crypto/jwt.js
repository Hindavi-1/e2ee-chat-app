/**
 * crypto/jwt.js
 * -------------
 * Placeholder for JSON Web Token (JWT) signing and verification helpers.
 *
 * ── What is a JWT? ───────────────────────────────────────────────────────
 * A JWT is a compact, URL-safe token that proves a user is authenticated.
 * It has three parts separated by dots:  header.payload.signature
 *
 * Flow:
 *   1. User logs in with correct credentials
 *   2. Server signs a JWT containing { userId, exp } using a secret key
 *   3. Client stores the JWT (in memory or httpOnly cookie)
 *   4. Client sends the JWT with every protected API request: "Authorization: Bearer <token>"
 *   5. Server verifies the token's signature to confirm it's genuine and not expired
 *
 * !! DO NOT IMPLEMENT !! — This is a placeholder only.
 */




const jwt = require('jsonwebtoken');

// Generate token
const signToken = (userId) => {
  return jwt.sign(
    { id: userId },                 // payload
    process.env.JWT_SECRET,         // secret key
    { expiresIn: '7d' }             // token expiry
  );
};

// Verify token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  signToken,
  verifyToken
};