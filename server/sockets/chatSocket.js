const { Server } = require('socket.io');
const { verifyToken } = require('../crypto/jwt');
const chatService    = require('../services/chatService');
const Message        = require('../models/Message');

// Maps userId (string) → socket.id so we can route messages to the right socket
const userSocketMap = {};

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // ── Auth middleware for every socket connection ──────────────────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error: no token'));

    const decoded = verifyToken(token);
    if (!decoded) return next(new Error('Authentication error: invalid token'));

    socket.userId = decoded.id.toString();
    next();
  });

  // ── Connection Handler ───────────────────────────────────────────────────
  io.on('connection', (socket) => {
    const userId = socket.userId;
    userSocketMap[userId] = socket.id;
    console.log(`[socket] User ${userId} connected (${socket.id})`);

    // Join a private room named after the user's ID
    socket.join(`user-${userId}`);

    // ── Send Message ─────────────────────────────────────────────────────
    // Payload: { receiverId, ciphertext, iv }
    socket.on('sendMessage', async (data) => {
      try {
        const { receiverId, ciphertext, iv } = data;
        if (!receiverId || !ciphertext || !iv) return;

        // 1. Persist to MongoDB (server stores only ciphertext — never decrypts)
        const saved = await chatService.saveMessage(userId, receiverId, ciphertext, iv);

        // 2. Emit to the recipient's private room (if they're online)
        io.to(`user-${receiverId}`).emit('receiveMessage', {
          _id:        saved._id,
          sender:     userId,
          receiver:   receiverId,
          ciphertext: saved.ciphertext,
          iv:         saved.iv,
          createdAt:  saved.createdAt,
        });

        // 3. Echo back to sender (so sender's own UI updates from the server)
        socket.emit('messageSent', {
          _id:        saved._id,
          sender:     userId,
          receiver:   receiverId,
          ciphertext: saved.ciphertext,
          iv:         saved.iv,
          createdAt:  saved.createdAt,
        });
      } catch (err) {
        console.error('[socket] sendMessage error:', err.message);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // ── Typing Indicator ────────────────────────────────────────────────────
    socket.on('typing', ({ receiverId }) => {
      io.to(`user-${receiverId}`).emit('typing', { senderId: userId });
    });

    socket.on('stopTyping', ({ receiverId }) => {
      io.to(`user-${receiverId}`).emit('stopTyping', { senderId: userId });
    });

    // ── Message Status Updates ───────────────────────────────────────────────
    socket.on('messageDelivered', async ({ messageId, senderId }) => {
      try {
        await Message.findByIdAndUpdate(messageId, { status: 'delivered' });
        // Notify the original sender that their message was delivered
        io.to(`user-${senderId}`).emit('messageDelivered', { messageId });
      } catch (err) {
        console.error('[socket] messageDelivered error:', err.message);
      }
    });

    socket.on('messagesSeen', async ({ senderId }) => {
      try {
        // Update all unread messages from this sender to 'seen'
        await Message.updateMany(
          { sender: senderId, receiver: userId, status: { $ne: 'seen' } },
          { status: 'seen' }
        );
        // Notify the sender that their messages were seen
        io.to(`user-${senderId}`).emit('messagesSeen', { receiverId: userId });
      } catch (err) {
        console.error('[socket] messagesSeen error:', err.message);
      }
    });

    // ── Disconnect ───────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      delete userSocketMap[userId];
      console.log(`[socket] User ${userId} disconnected`);
    });
  });

  console.log('[socket] Socket.IO initialized');
  return io;
};

module.exports = initSocket;
