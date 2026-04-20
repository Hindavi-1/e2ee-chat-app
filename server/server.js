/**
 * server.js
 * ---------
 * Main entry point for the Express + Socket.IO server.
 *
 * What this file does RIGHT NOW:
 *   - Creates an Express app
 *   - Attaches Socket.IO to an HTTP server
 *   - Registers API route groups
 *   - Starts listening on a port
 *
 * What you will add LATER:
 *   - Real database connection (via config/db.js)
 *   - HTTPS / TLS configuration for secure transport
 *   - Helmet, rate-limiting, and other security middleware
 *   - Environment-variable validation (dotenv)
 */



const express = require("express");
const http = require("http");
const cors = require("cors");

// Route files (placeholders for now)
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

// Socket.IO setup (placeholder)
const initSocket = require("./sockets/chatSocket");

// ── App & Server Setup ─────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app); // Wrap Express in Node's HTTP server so Socket.IO can attach

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors()); // Allow cross-origin requests from the React dev server
app.use(express.json()); // Parse incoming JSON request bodies

// ── API Routes ─────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes); // → POST /api/auth/register, /api/auth/login
app.use("/api/messages", chatRoutes); // → GET /api/messages, POST /api/messages

// ── Health Check ───────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "Server is running", message: "Secure Chat API" });
});

// ── Socket.IO ──────────────────────────────────────────────────────────────
initSocket(server); // Attach real-time socket handlers (see sockets/chatSocket.js)

// ── Start Server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  // TODO: Connect to MongoDB here → require('./config/db').connectDB()
  require('dotenv').config();
  const connectDB = require('./config/db');
  connectDB();
});



//temporary test route
app.get('/test-db', async (req, res) => {
  try {
    const User = require('./models/User');

    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});