const chatService = require('../services/chatService');

// GET /api/messages?contactId=<id>
// Returns message history between the authenticated user and a contact
const getMessages = async (req, res) => {
  try {
    const { contactId } = req.query;
    if (!contactId) return res.status(400).json({ message: 'contactId is required' });

    const messages = await chatService.getMessages(req.user.id, contactId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/messages
// Saves an encrypted message (called via HTTP fallback — real-time uses socket)
const sendMessage = async (req, res) => {
  try {
    const { receiverId, ciphertext, iv } = req.body;
    if (!receiverId || !ciphertext || !iv)
      return res.status(400).json({ message: 'receiverId, ciphertext, and iv are required' });

    const message = await chatService.saveMessage(req.user.id, receiverId, ciphertext, iv);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMessages, sendMessage };
