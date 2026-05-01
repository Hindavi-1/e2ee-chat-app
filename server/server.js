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
const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

app.use(express.json());

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
server.listen(PORT, () => {
  console.log(`✅  Server running on http://localhost:${PORT}`);
});
