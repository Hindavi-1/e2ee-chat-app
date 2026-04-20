const Message = require('../models/Message');
const mongoose = require('mongoose');

/**
 * saveMessage()
 * Persists an E2EE message to MongoDB.
 * The server only ever stores ciphertext — never plaintext.
 */
const saveMessage = async (senderId, receiverId, ciphertext, iv) => {
  const message = await Message.create({ sender: senderId, receiver: receiverId, ciphertext, iv });
  return message;
};

/**
 * getMessages()
 * Fetches the full message history between two users, sorted oldest first.
 */
const getMessages = async (userId, contactId) => {
  const uid = new mongoose.Types.ObjectId(userId);
  const cid = new mongoose.Types.ObjectId(contactId);

  const messages = await Message.find({
    $or: [
      { sender: uid, receiver: cid },
      { sender: cid, receiver: uid },
    ],
  })
    .sort({ createdAt: 1 })
    .lean();

  return messages;
};

module.exports = { saveMessage, getMessages };
