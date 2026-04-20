/**
 * models/Message.js
 * -----------------
 * Defines the shape (schema) of a Message document in MongoDB.
 *
 * What this file does RIGHT NOW:
 *   - Exports a plain JavaScript object describing the intended schema
 *
 * What you will add LATER:
 *   - A real Mongoose Schema and Model
 *   - References to the User model for sender and recipient fields
 *
 * IMPORTANT (end-to-end encryption design):
 *   The `ciphertext` field holds AES-encrypted content produced by the CLIENT.
 *   The server NEVER sees or stores the plaintext message.
 *   Only the intended recipient, who holds the correct AES key, can decrypt it.
 *
 * Fields planned for the real schema:
 *   - sender      : ObjectId ref → User
 *   - recipient   : ObjectId ref → User
 *   - ciphertext  : string (AES-GCM encrypted message, base64-encoded)
 *   - iv          : string (AES initialization vector, base64-encoded — needed for decryption)
 *   - createdAt   : Date
 */

// ── Placeholder Schema Description ────────────────────────────────────────
// const MessageSchemaDescription = {
//   sender: "ObjectId — references the User who sent the message",
//   recipient: "ObjectId — references the User who should receive the message",
//   ciphertext:
//     "String — AES-encrypted message content (server never decrypts this)",
//   iv: "String — AES initialization vector required for decryption on the client",
//   createdAt: "Date — auto-generated timestamp",
// };

/**
 * createMessagePlaceholder()
 * A dummy factory showing what a Message object will look like.
//  */
// const createMessagePlaceholder = ({ senderId, recipientId, ciphertext, iv }) => {
//   return {
//     id: `msg-${Date.now()}`,
//     sender: senderId,
//     recipient: recipientId,
//     ciphertext: ciphertext || "<encrypted-content>",
//     iv: iv || "<initialization-vector>",
//     createdAt: new Date().toISOString(),
//   };
// };

// module.exports = { MessageSchemaDescription, createMessagePlaceholder };

// ── What the real Mongoose model will look like ───────────────────────────
/*
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ciphertext: { type: String, required: true },
  iv:         { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
*/


const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ciphertext: {
      type: String,
      required: true
    },
    iv: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);