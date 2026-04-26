const User = require('../models/User');
const Message = require('../models/Message');
const mongoose = require('mongoose');
const { protect } = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

// GET /api/users — list all users except self (for contact list)
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select('_id username email publicKey')
      .lean();

    const currentUserId = new mongoose.Types.ObjectId(req.user.id);

    // Fetch lastMessageAt and unreadCount for each contact
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const contactId = new mongoose.Types.ObjectId(user._id);

        const lastMsg = await Message.findOne({
          $or: [
            { sender: currentUserId, receiver: contactId },
            { sender: contactId, receiver: currentUserId }
          ]
        }).sort({ createdAt: -1 });

        const unreadCount = await Message.countDocuments({
          sender: contactId,
          receiver: currentUserId,
          status: { $ne: 'seen' }
        });

        return {
          ...user,
          lastMessageAt: lastMsg ? lastMsg.createdAt : null,
          unreadCount
        };
      })
    );

    res.json(usersWithStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:id/publicKey — fetch one user's ECDH public key
router.get('/:id/publicKey', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('publicKey username').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ publicKey: user.publicKey, username: user.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
