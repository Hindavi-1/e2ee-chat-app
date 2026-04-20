/**
 * services/chatService.js
 * ------------------------
 * Business logic for storing and retrieving messages.
 *
 * What this file does RIGHT NOW:
 *   - Returns dummy/in-memory message data
 *
 * What you will add LATER:
 *   - Import the Message model from models/Message.js
 *   - Query MongoDB for real messages
 *   - Save incoming encrypted messages to the database
 *
 * IMPORTANT (encryption design reminder):
 *   This service handles CIPHERTEXT only.
 *   Messages are encrypted by the CLIENT before arriving here.
 *   The server stores and retrieves the encrypted blob — it never decrypts anything.
 */

// In-memory store (temporary — replace with MongoDB queries)
const mockMessages = [
  {
    id: "msg-001",
    sender: "alice",
    recipient: "bob",
    ciphertext: "<encrypted-content-placeholder>",
    iv: "<iv-placeholder>",
    createdAt: new Date().toISOString(),
  },
];

/**
 * getMessagesForUser()
 * Fetches all messages involving a specific user.
 *
 * @param {string} userId - The ID of the requesting user
 * @returns {Array}       - Array of message objects (encrypted)
 */
const getMessagesForUser = async (userId) => {
  // TODO: Query MongoDB → Message.find({ $or: [{ sender: userId }, { recipient: userId }] })
  // TODO: Sort by createdAt ascending (oldest first)

  console.log(`[chatService] getMessagesForUser() placeholder for userId: ${userId}`);

  return mockMessages;
};

/**
 * saveMessage()
 * Persists a new encrypted message to the database.
 *
 * @param {string} senderId    - ID of the user sending the message
 * @param {string} recipientId - ID of the intended recipient
 * @param {string} ciphertext  - AES-encrypted message content
 * @param {string} iv          - AES initialization vector (needed to decrypt)
 * @returns {object}           - The saved message document
 */
const saveMessage = async (senderId, recipientId, ciphertext, iv) => {
  // TODO: Create a new Message document and save it to MongoDB
  // const message = new Message({ sender: senderId, recipient: recipientId, ciphertext, iv });
  // await message.save();
  // return message;

  console.log(`[chatService] saveMessage() placeholder called`);

  const newMessage = {
    id: `msg-${Date.now()}`,
    sender: senderId,
    recipient: recipientId,
    ciphertext,
    iv,
    createdAt: new Date().toISOString(),
  };

  mockMessages.push(newMessage);
  return newMessage;
};

module.exports = { getMessagesForUser, saveMessage };
