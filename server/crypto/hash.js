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
 **/

const bcrypt = require('bcrypt');

// Hash password before saving to DB
const hashPassword = async (password) => {
  const saltRounds = 10; // cost factor
  return await bcrypt.hash(password, saltRounds);
};

// Compare entered password with stored hash
const comparePassword = async (enteredPassword, storedHash) => {
  return await bcrypt.compare(enteredPassword, storedHash);
};

module.exports = {
  hashPassword,
  comparePassword
};

