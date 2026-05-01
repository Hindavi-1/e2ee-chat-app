require('dotenv').config();

const express  = require('express');
const http     = require('http');
const cors     = require('cors');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const initSocket = require('./sockets/chatSocket');
const connectDB  = require('./config/db');

// ── Connect to MongoDB ──────────────────────────────────────────────────────
connectDB();

// ── App & Server Setup ──────────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);

// ── Middleware ──────────────────────────────────────────────────────────────
// app.use(cors());
// ── Middleware ──────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL
];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// ✅ Order matters
app.use(express.json());          // 1️⃣ parse body first
app.use(cors(corsOptions));       // 2️⃣ then CORS
app.options("*", cors(corsOptions)); // 3️⃣ preflight

// ── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/messages', chatRoutes);
app.use('/api/users',    userRoutes);

// ── Health Check ────────────────────────────────────────────────────────────
app.get('/', (_req, res) => res.json({ status: 'ok', app: 'SecureChat API' }));

// ── Socket.IO ───────────────────────────────────────────────────────────────
initSocket(server);

// ── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅  Server running on http://localhost:${PORT}`);
});
