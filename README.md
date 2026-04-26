# 🔐 SecureChat — End-to-End Encrypted MERN Chat

A full-stack, real-time chat application with **true end-to-end encryption**. Built with the MERN stack (MongoDB, Express, React, Node.js), SecureChat ensures the server **never** sees plaintext messages — all encryption and decryption happens client-side using the Web Crypto API.

---

## ✨ Features

### 🔒 Security
- **End-to-End Encryption (E2EE)** — Messages encrypted client-side with **AES-256-GCM**; keys exchanged via **Elliptic-Curve Diffie-Hellman (ECDH, P-256)**
- **Zero-Knowledge Server** — The server stores only ciphertext and IVs; it never decrypts messages
- **Secure Authentication** — Passwords hashed with **bcrypt**; sessions managed via **JWT**
- **Per-Device Key Persistence** — ECDH private keys stored in `localStorage` per user email, enabling seamless reconnections

### 💬 Messaging
- **Real-Time Communication** — Instant bidirectional messaging powered by **Socket.IO**
- **Message Status Tracking** — WhatsApp-style tick indicators: ✓ Sent → ✓✓ Delivered → ✓✓ Seen (blue)
- **Read Receipts** — Automatic `delivered` on receive, `seen` when chat is opened
- **Typing Indicators** — Real-time "typing…" bubble animation with auto-timeout
- **Persistent Chat History** — Encrypted messages stored in MongoDB and decrypted on load
- **Optimistic UI** — Messages appear instantly on send, then reconcile with server confirmation

### 🎨 Interface
- **Premium Dark Theme** — Midnight obsidian palette with glassmorphism, gradient bubbles, and smooth animations
- **Contact Sidebar** — Sorted by latest message activity, with unread notification badges (pulsing green)
- **Contact Search** — Live client-side filtering with clear button and "no matches" empty state
- **Sticky Chat Header** — Contact name and encryption status always visible while scrolling
- **Responsive Layout** — Full mobile support with slide-in sidebar and backdrop overlay
- **Scrollable Messages** — Messages scroll within a fixed container; header and input bar remain anchored

---

## 📁 Project Structure

```text
secure-chat/
├── client/                          # React frontend (CRA)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx       # Message list, input area, sticky header
│   │   │   ├── MessageBubble.jsx    # Individual bubble + status tick SVGs
│   │   │   └── Sidebar.jsx          # Contact list, search, unread badges
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state provider (React Context)
│   │   ├── crypto/
│   │   │   ├── aes.js               # AES-256-GCM encrypt/decrypt (Web Crypto)
│   │   │   ├── ecdh.js              # ECDH P-256 key generation & derivation
│   │   │   └── keyDerivation.js     # Key derivation utilities
│   │   ├── hooks/
│   │   │   └── useMessages.js       # Message lifecycle: load, send, decrypt, status
│   │   ├── pages/
│   │   │   ├── Chat.jsx             # Main chat page layout + ECDH key exchange
│   │   │   ├── Login.jsx            # Login form
│   │   │   └── Register.jsx         # Registration form + ECDH key pair generation
│   │   ├── services/
│   │   │   ├── api.js               # Centralized fetch wrapper with JWT headers
│   │   │   ├── authService.js       # Login/register API calls
│   │   │   ├── chatService.js       # Message + contact API calls
│   │   │   └── socketService.js     # Socket.IO client: connect, emit, listen
│   │   ├── App.jsx                  # Root component + page state routing
│   │   ├── index.css                # Full design system (CSS variables, layout)
│   │   └── index.js                 # React entry point
│   └── package.json
│
└── server/                          # Node.js + Express backend
    ├── config/
    │   └── db.js                    # MongoDB connection via Mongoose
    ├── controllers/
    │   ├── authController.js        # Register + Login handlers
    │   └── chatController.js        # Get/Send message handlers
    ├── crypto/
    │   └── jwt.js                   # JWT sign + verify utilities
    ├── middleware/
    │   └── authMiddleware.js        # JWT auth guard for protected routes
    ├── models/
    │   ├── Message.js               # Message schema (sender, receiver, ciphertext, iv, status)
    │   └── User.js                  # User schema (username, email, password, publicKey)
    ├── routes/
    │   ├── authRoutes.js            # POST /register, /login
    │   ├── chatRoutes.js            # GET/POST /messages (protected)
    │   └── userRoutes.js            # GET /users, GET /users/:id/publicKey (protected)
    ├── services/
    │   └── chatService.js           # Message persistence logic
    ├── sockets/
    │   └── chatSocket.js            # Socket.IO event handlers + auth middleware
    ├── server.js                    # Express + HTTP + Socket.IO entry point
    └── package.json
```

---

## 🛠 Tech Stack

| Layer       | Technology                                                  |
|-------------|-------------------------------------------------------------|
| Frontend    | React 18, CSS (custom design system), Socket.IO Client      |
| Backend     | Node.js, Express, Socket.IO                                 |
| Database    | MongoDB + Mongoose                                          |
| Auth        | bcrypt (password hashing), JSON Web Tokens (JWT)            |
| Encryption  | Web Crypto API — ECDH P-256 (key exchange), AES-256-GCM     |
| Dev Tools   | nodemon, ESLint, Create React App                           |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v14 or higher
- **MongoDB** — Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone the Repository
```bash
git clone https://github.com/Hindavi-1/e2ee-chat-app.git
cd e2ee-chat-app
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the server:
```bash
npm run dev        # Development (auto-reload with nodemon)
npm start          # Production
```

### 3. Frontend Setup
```bash
cd client
npm install
npm start          # starts React dev server on http://localhost:3000
```

### 4. Test It Out
1. Open **two browser windows** (or one regular + one incognito)
2. Register two different user accounts
3. Select a contact from the sidebar to initiate the ECDH key exchange
4. Start chatting — all messages are end-to-end encrypted! 🔒

---

## 🔒 Security Architecture

```text
CLIENT A                          SERVER                           CLIENT B
────────                          ──────                           ────────
Generate ECDH key pair            Store public keys only
Send publicKey ────────────────→  Save to User.publicKey
                                                         ←──────── Send publicKey
                     ←─────────── Fetch B's publicKey
Derive sharedKey =                                       Derive sharedKey =
  ECDH(myPrivKey, B's pubKey)                              ECDH(myPrivKey, A's pubKey)

                                                         ← same value on both sides! →
                                                         

Encrypt msg with AES-GCM ──────→ Store ciphertext ──────────────→ Decrypt with AES-GCM
(sharedKey + random IV)           (never decrypts)                 (same sharedKey + IV)
```

> **Note:** The server is zero-knowledge — it never decrypts messages. It only stores and forwards encrypted ciphertext and IVs. This ensures true end-to-end encryption.

---

## 📋 API Endpoints

### Authentication
| Method | Endpoint               | Description                        | Auth |
|--------|------------------------|------------------------------------|------|
| POST   | `/api/auth/register`   | Create new user + store public key | No   |
| POST   | `/api/auth/login`      | Authenticate and receive JWT       | No   |

### Users
| Method | Endpoint                     | Description                          | Auth |
|--------|------------------------------|--------------------------------------|------|
| GET    | `/api/users`                 | List all contacts with unread counts | Yes  |
| GET    | `/api/users/:id/publicKey`   | Fetch a user's ECDH public key       | Yes  |

### Messages
| Method | Endpoint            | Description                         | Auth |
|--------|---------------------|-------------------------------------|------|
| GET    | `/api/messages`     | Fetch encrypted messages for a chat | Yes  |
| POST   | `/api/messages`     | Save an encrypted message           | Yes  |

---

## 🔌 Socket.IO Events

### Client → Server
| Event              | Payload                              | Description                     |
|--------------------|--------------------------------------|---------------------------------|
| `sendMessage`      | `{ receiverId, ciphertext, iv }`     | Send an encrypted message       |
| `typing`           | `{ receiverId }`                     | Notify recipient of typing      |
| `stopTyping`       | `{ receiverId }`                     | Notify recipient stopped typing |
| `messageDelivered` | `{ messageId, senderId }`            | Confirm message delivery        |
| `messagesSeen`     | `{ senderId }`                       | Mark all messages from sender as seen |

### Server → Client
| Event              | Payload                                                   | Description                        |
|--------------------|-----------------------------------------------------------|------------------------------------|
| `receiveMessage`   | `{ _id, sender, receiver, ciphertext, iv, createdAt }`   | Incoming message from another user |
| `messageSent`      | `{ _id, sender, receiver, ciphertext, iv, createdAt }`   | Echo-back confirming message saved |
| `messageDelivered` | `{ messageId }`                                           | Tick update: delivered             |
| `messagesSeen`     | `{ receiverId }`                                          | Tick update: seen                  |
| `typing`           | `{ senderId }`                                            | Sender is typing                   |
| `stopTyping`       | `{ senderId }`                                            | Sender stopped typing              |

---

## 📊 Database Schemas

### User
| Field       | Type     | Description                        |
|-------------|----------|------------------------------------|
| `username`  | String   | Display name                       |
| `email`     | String   | Unique email (login identifier)    |
| `password`  | String   | bcrypt hash                        |
| `publicKey` | String   | ECDH P-256 public key (JWK/base64) |
| `createdAt` | Date     | Auto-generated                     |

### Message
| Field        | Type     | Description                              |
|--------------|----------|------------------------------------------|
| `sender`     | ObjectId | Reference to User                        |
| `receiver`   | ObjectId | Reference to User                        |
| `ciphertext` | String   | AES-GCM encrypted message (base64)      |
| `iv`         | String   | Initialization vector for decryption     |
| `status`     | String   | `sent` · `delivered` · `seen`            |
| `createdAt`  | Date     | Auto-generated                           |

---


