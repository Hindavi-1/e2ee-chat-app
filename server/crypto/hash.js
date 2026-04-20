/**
 * crypto/hash.js
 * --------------
 * Placeholder for password hashing helpers using bcrypt.
 *
 * ── Why hash passwords? ───────────────────────────────────────────────────
 * Passwords must NEVER be stored as plaintext.
 * bcrypt is a one-way hashing function — you can verify a password against
 * a hash, but you cannot reverse the hash to get the original password.
 *
 * bcrypt also "salts" the password (adds random data before hashing),
 * which means two identical passwords produce different hashes.
 * This protects against rainbow table attacks.
 *
 * !! DO NOT IMPLEMENT !! — This is a placeholder only.
 */

/**
 * hashPassword()
 * Hashes a plaintext password using bcrypt.
 *
 * @param {string} plaintext - The user's raw password
 * @returns {Promise<string>} - The bcrypt hash to store in the database
 */
const hashPassword = async (plaintext) => {
  // TODO: Implement:
  // const bcrypt = require('bcrypt');
  // const saltRounds = 12;   // Higher = slower but more secure (10-14 is typical)
  // return await bcrypt.hash(plaintext, saltRounds);

  console.log("[hash.js] hashPassword() — placeholder, not implemented");
  return `hashed-${plaintext}-placeholder`;
};

/**
 * comparePassword()
 * Compares a plaintext password to a stored bcrypt hash.
 *
 * @param {string} plaintext - The password the user just typed
 * @param {string} hash      - The stored bcrypt hash from the database
 * @returns {Promise<boolean>} - true if they match, false otherwise
 */
const comparePassword = async (plaintext, hash) => {
  // TODO: Implement:
  // const bcrypt = require('bcrypt');
  // return await bcrypt.compare(plaintext, hash);

  console.log("[hash.js] comparePassword() — placeholder, not implemented");
  return true; // Always returns true for now — fix this before production!
};

module.exports = { hashPassword, comparePassword };
