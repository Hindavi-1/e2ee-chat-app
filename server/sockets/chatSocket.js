/**
 * sockets/chatSocket.js
 * ----------------------
 * Sets up Socket.IO for real-time bidirectional communication.
 *
 * What this file does RIGHT NOW:
 *   - Attaches Socket.IO to the HTTP server
 *   - Listens for a "connection" event and logs when a client connects
 *   - Has placeholder event handlers for sending and receiving messages
 *
 * What you will add LATER:
 *   - Authenticate the socket connection using the JWT token
 *   - Support "rooms" so each pair of users has a private channel
 *   - Emit events to specific users (not just broadcast to everyone)
 *   - Handle the "disconnect" event to update user online status
 *
 * ── How Socket.IO works (brief overview) ─────────────────────────────────
 * Unlike HTTP (request → response), Socket.IO keeps a persistent connection open.
 * Either side (client or server) can emit an event at any time.
 *
 *   Client emits  → "sendMessage"   → server receives it
 *   Server emits  → "receiveMessage" → client receives it
 */

const { Server } = require("socket.io");

/**
 * initSocket()
 * Attaches Socket.IO to the HTTP server and registers event handlers.
 *
 * @param {http.Server} server - The Node.js HTTP server from server.js
 */
const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Allow connections from the React dev server
      methods: ["GET", "POST"],
    },
  });

  // ── Connection Handler ──────────────────────────────────────────────────
  io.on("connection", (socket) => {
    console.log(`[chatSocket] Client connected: ${socket.id}`);

    // TODO: Authenticate the socket here
    // const token = socket.handshake.auth.token;
    // Verify the JWT token using crypto/jwt.js → jwtHelper.verifyToken(token)
    // If invalid, call socket.disconnect()

    // TODO: Join a private room for this user
    // socket.join(`user-${userId}`);

    // ── Send Message Event ─────────────────────────────────────────────────
    // The client emits "sendMessage" when the user sends a message
    socket.on("sendMessage", (data) => {
      // data will contain: { recipientId, ciphertext, iv }
      // The message content is already AES-encrypted by the client

      console.log(`[chatSocket] sendMessage received from ${socket.id}`);

      // TODO: Save the message to MongoDB via chatService.saveMessage()
      // TODO: Emit "receiveMessage" ONLY to the intended recipient:
      //   io.to(`user-${data.recipientId}`).emit('receiveMessage', data);

      // Placeholder: broadcast to all connected clients (not secure — fix later!)
      socket.broadcast.emit("receiveMessage", {
        ...data,
        from: socket.id,
        timestamp: new Date().toISOString(),
      });
    });

    // ── Disconnect Event ───────────────────────────────────────────────────
    socket.on("disconnect", () => {
      console.log(`[chatSocket] Client disconnected: ${socket.id}`);
      // TODO: Update user's online status in the database
    });
  });

  console.log("[chatSocket] Socket.IO initialized");
  return io;
};

module.exports = initSocket;
