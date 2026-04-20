/**
 * models/User.js
 * --------------
 * Defines the shape (schema) of a User document in MongoDB.
 *
 * What this file does RIGHT NOW:
 *   - Exports a plain JavaScript object describing the intended schema
 *   - No real database connection is made
 *
 * What you will add LATER:
 *   - Import mongoose
 *   - Define a real Mongoose Schema
 *   - Add password hashing via a pre-save hook (using bcrypt)
 *   - Export a Mongoose Model
 *
 * Fields planned for the real schema:
 *   - username  : string, required, unique
 *   - password  : string, required (will store bcrypt hash, never plaintext)
 *   - publicKey : string (the user's ECDH public key, stored so other users can encrypt to them)
 *   - createdAt : Date (auto-managed by Mongoose timestamps option)
 */

// ── Placeholder Schema Description ────────────────────────────────────────
// This is just documentation — not real Mongoose code yet.
const UserSchemaDescription = {
  username: "String — unique identifier for the user",
  password: "String — bcrypt hash (NEVER store plaintext passwords)",
  publicKey:
    "String — ECDH public key, shared with other users for key exchange",
  createdAt: "Date — auto-generated timestamp",
};

/**
 * createUserPlaceholder()
 * A dummy factory function showing what a User object will look like.
 * Replace this with a real Mongoose model later.
 */
const createUserPlaceholder = ({ username, password, publicKey }) => {
  return {
    id: `user-${Date.now()}`, // MongoDB will auto-generate _id
    username,
    password, // TODO: This must be a bcrypt hash in the real implementation!
    publicKey: publicKey || null,
    createdAt: new Date().toISOString(),
  };
};

module.exports = { UserSchemaDescription, createUserPlaceholder };

// ── What the real Mongoose model will look like ───────────────────────────
/*
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username:  { type: String, required: true, unique: true, trim: true },
  password:  { type: String, required: true },              // bcrypt hash
  publicKey: { type: String, default: null },               // ECDH public key
}, { timestamps: true });

// Hash the password before saving if it was modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);
*/
