# 🔐 SecureChat — End-to-End Encrypted MERN Chat

A secure, end-to-end encrypted chat application built with the MERN stack (MongoDB, Express, React, Node.js) featuring real-time messaging, secure key exchange, and a premium user interface.

---

## ✨ Features

- **End-to-End Encryption (E2EE):** Messages are encrypted locally on the client using AES-GCM and keys are exchanged securely via Elliptic-Curve Diffie-Hellman (ECDH). The server never sees the plaintext.
- **Real-Time Messaging:** Instant bidirectional communication powered by Socket.IO.
- **Authentication:** Secure user registration and login using bcrypt for password hashing and JWT for session management.
- **Modern UI/UX:** Responsive, premium design with Framer Motion animations and dark mode support.
- **Persistent Storage:** Encrypted messages are securely stored in MongoDB for seamless chat history retrieval.

---

## 📁 Project Structure

```text
secure-chat/
├── client/                        # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── context/               # React Context for global state
│   │   ├── crypto/                # Web Crypto API implementations (AES, ECDH)
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── pages/                 # Main application views
│   │   ├── services/              # API clients and Socket.IO management
│   │   ├── App.jsx                # Root component + routing
│   │   └── index.js               # React entry point
│   └── package.json
│
└── server/                        # Node.js + Express backend
    ├── config/                    # MongoDB and environment configurations
    ├── controllers/               # Route handlers (Auth, Chat)
    ├── crypto/                    # Server-side crypto (bcrypt, JWT)
    ├── middleware/                # Express middlewares (Auth verification)
    ├── models/                    # Mongoose database schemas
    ├── routes/                    # API route definitions
    ├── services/                  # Business logic (Auth, Chat)
    ├── sockets/                   # Socket.IO event handlers
    ├── server.js                  # Express app entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local instance or MongoDB Atlas cluster)

### Backend Setup
```bash
cd server
npm install
# Create a .env file with your MONGO_URI and JWT_SECRET
npm run dev        # uses nodemon for auto-reload
```

### Frontend Setup
```bash
cd client
npm install
npm start          # starts React dev server on http://localhost:3000
```

---

## 🔒 Security Architecture

```text
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
| GET    | /api/messages/:id     | Fetch messages for a contact   | Yes           |
| POST   | /api/messages         | Send an encrypted message      | Yes           |
