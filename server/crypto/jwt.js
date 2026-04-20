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

/**
 * signToken()
 * Creates and signs a JWT for an authenticated user.
 *
 * @param {string} userId - The user's MongoDB ObjectId (or unique identifier)
 * @returns {string}      - A signed JWT string
 */
const signToken = (userId) => {
  // TODO: Implement using the 'jsonwebtoken' npm package:
  // const jwt = require('jsonwebtoken');
  // return jwt.sign(
  //   { userId },
  //   process.env.JWT_SECRET,
  //   { expiresIn: '7d' }   // token expires in 7 days
  // );

  console.log(`[jwt.js] signToken() — placeholder for userId: ${userId}`);
  return `placeholder-token-for-${userId}`;
};

/**
 * verifyToken()
 * Verifies a JWT and returns the decoded payload.
 *
 * @param {string} token - The JWT string from the Authorization header
 * @returns {object}     - Decoded payload (e.g., { userId, iat, exp })
 * @throws               - If the token is invalid, expired, or tampered with
 */
const verifyToken = (token) => {
  // TODO: Implement:
  // const jwt = require('jsonwebtoken');
  // return jwt.verify(token, process.env.JWT_SECRET);
  // ↑ This throws if the token is invalid — catch it in authMiddleware

  console.log("[jwt.js] verifyToken() — placeholder, not implemented");
  return { userId: "placeholder-user-id" };
};

module.exports = { signToken, verifyToken };
