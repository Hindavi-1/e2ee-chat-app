# 🔐 SecureChat — MERN Stack Skeleton

A clean, well-documented starting skeleton for a secure, end-to-end encrypted chat application.

> **This is a skeleton only.** No real authentication, encryption, or database logic is implemented.
> All crypto files contain detailed comments explaining exactly what to implement and how.

---

## 📁 Project Structure

```
secure-chat/
├── client/                        # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx     # Message area + input box
│   │   │   ├── MessageBubble.jsx  # Single message bubble
│   │   │   └── Sidebar.jsx        # Contact list
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state shared across app
│   │   ├── crypto/                ⚠️  PLACEHOLDERS ONLY
│   │   │   ├── aes.js             # AES-GCM encrypt/decrypt (client-side)
│   │   │   └── ecdh.js            # ECDH key generation & key exchange
│   │   ├── hooks/
│   │   │   └── useMessages.js     # Message state + send/receive logic
│   │   ├── pages/
│   │   │   ├── Chat.jsx           # Main chat page (Sidebar + ChatWindow)
│   │   │   ├── Login.jsx          # Login form
│   │   │   └── Register.jsx       # Registration form
│   │   ├── services/
│   │   │   ├── api.js             # Central HTTP client (fetch wrapper)
│   │   │   ├── authService.js     # Login / register API calls
│   │   │   ├── chatService.js     # Message fetch / send API calls
│   │   │   └── socketService.js   # Socket.IO connection management
│   │   ├── App.jsx                # Root component + page routing
│   │   └── index.js               # React entry point
│   └── package.json
│
└── server/                        # Node.js + Express backend
    ├── config/
    │   └── db.js                  # MongoDB connection (placeholder)
    ├── controllers/
    │   ├── authController.js      # Register / login handlers
    │   └── chatController.js      # Get / send message handlers
    ├── crypto/                    ⚠️  PLACEHOLDERS ONLY
    │   ├── hash.js                # bcrypt password hashing
    │   └── jwt.js                 # JWT sign / verify
    ├── middleware/
    │   └── authMiddleware.js      # JWT verification middleware (placeholder)
    ├── models/
    │   ├── Message.js             # Message schema (placeholder)
    │   └── User.js                # User schema (placeholder)
    ├── routes/
    │   ├── authRoutes.js          # POST /api/auth/register, /api/auth/login
    │   └── chatRoutes.js          # GET /api/messages, POST /api/messages
    ├── services/
    │   ├── authService.js         # Register / login business logic
    │   └── chatService.js         # Message fetch / save business logic
    ├── sockets/
    │   └── chatSocket.js          # Socket.IO real-time event handlers
    ├── server.js                  # Express app entry point
    └── package.json
```

---

## 🚀 Getting Started

### Backend
```bash
cd server
npm install
npm run dev        # uses nodemon for auto-reload
```

### Frontend
```bash
cd client
npm install
npm start          # starts React dev server on http://localhost:3000
```

---

## 🔒 Security Architecture (to implement)

```
CLIENT A                        SERVER                         CLIENT B
────────                        ──────                         ────────
Generate ECDH key pair          Store public keys only
Send publicKey ──────────────→  Save to User.publicKey
                                
                    ←───────── Fetch B's publicKey
Derive sharedKey =
  ECDH(myPrivKey, B's pubKey)
                                                 Derive sharedKey =
                                                   ECDH(myPrivKey, A's pubKey)
                                                 ← same value on both sides! →

Encrypt msg with AES-GCM ─────→ Store ciphertext ──────────→ Decrypt with AES-GCM
(sharedKey + random IV)          (never decrypts)              (same sharedKey + IV)
```

**Note:** The server does NOT decrypt messages. It only stores and forwards encrypted data. This ensures true end-to-end encryption.

---

## 📋 API Endpoints

| Method | Endpoint              | Description                   | Auth Required |
|--------|-----------------------|-------------------------------|---------------|
| POST   | /api/auth/register    | Create new user account        | No            |
| POST   | /api/auth/login       | Login and receive JWT token    | No            |
| GET    | /api/messages         | Fetch messages for current user| Yes (TODO)    |
| POST   | /api/messages         | Send an encrypted message      | Yes (TODO)    |

---

## ✅ Implementation Checklist

**Phase 1 — Database**
- [ ] Set up MongoDB Atlas or local MongoDB
- [ ] Implement real User and Message Mongoose models
- [ ] Connect via `config/db.js`

**Phase 2 — Authentication**
- [ ] Implement `crypto/hash.js` with bcrypt
- [ ] Implement `crypto/jwt.js` with jsonwebtoken
- [ ] Complete `services/authService.js` (real register + login)
- [ ] Complete `middleware/authMiddleware.js` (JWT verification)
- [ ] Complete `controllers/authController.js`

**Phase 3 — Encryption**
- [ ] Implement `client/src/crypto/ecdh.js` (Web Crypto API)
- [ ] Implement `client/src/crypto/aes.js` (Web Crypto API)
- [ ] Wire encryption into `hooks/useMessages.js`
- [ ] Wire ECDH key exchange into `pages/Chat.jsx`

**Phase 4 — Real-time**
- [ ] Complete `sockets/chatSocket.js` (auth + rooms)
- [ ] Complete `services/socketService.js` on client
- [ ] Connect socket in `pages/Chat.jsx`
