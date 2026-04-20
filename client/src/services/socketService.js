/**
 * services/socketService.js
 * --------------------------
 * Manages the Socket.IO connection for real-time messaging.
 *
 * What this file does RIGHT NOW:
 *   - Exports placeholder connect/disconnect/send functions that only log
 *
 * What you will add LATER:
 *   - Create a real Socket.IO connection using socket.io-client
 *   - Pass the JWT token in the handshake for authentication
 *   - Emit encrypted messages and receive incoming ones
 *
 * ── Key design note (encryption) ─────────────────────────────────────────
 * Messages must be AES-ENCRYPTED before emitting via sendMessage().
 * When receiving via onMessage(), the payload is still ciphertext —
 * decrypt it in the component using aes.decryptMessage().
 */

// Will hold the socket.io-client instance once connected
let socket = null;

/**
 * connect()
 * Establishes the Socket.IO connection to the server.
 *
 * @param {string} token - JWT token for authentication (passed in handshake)
 */
export const connect = (token) => {
  console.log('[socketService] connect() placeholder called');

  // TODO: Install socket.io-client: npm install socket.io-client
  // TODO: Implement:
  // import { io } from 'socket.io-client';
  // socket = io('http://localhost:5000', {
  //   auth: { token },  // server reads this in socket.handshake.auth.token
  // });
  // socket.on('connect', () => console.log('Socket connected:', socket.id));
  // socket.on('connect_error', (err) => console.error('Socket error:', err.message));
};

/**
 * disconnect()
 * Cleanly closes the Socket.IO connection.
 */
export const disconnect = () => {
  console.log('[socketService] disconnect() placeholder called');
  // TODO: if (socket) socket.disconnect();
};

/**
 * sendMessage()
 * Emits an encrypted message to the server via socket.
 *
 * @param {object} payload - { recipientId, ciphertext, iv }
 *
 * ENCRYPTION NOTE:
 *   Always encrypt BEFORE calling this function.
 *   payload.ciphertext must be the AES-encrypted content.
 */
export const sendMessage = (payload) => {
  console.log('[socketService] sendMessage() placeholder — payload:', payload);
  // TODO: if (socket) socket.emit('sendMessage', payload);
};

/**
 * onMessage()
 * Registers a callback to run whenever a new message is received.
 *
 * @param {Function} callback - Called with the message payload: { ciphertext, iv, from, timestamp }
 *
 * DECRYPTION NOTE:
 *   The received payload contains ciphertext — decrypt it in your component or hook.
 */
export const onMessage = (callback) => {
  console.log('[socketService] onMessage() placeholder — listener registered');
  // TODO: if (socket) socket.on('receiveMessage', callback);
};

/**
 * offMessage()
 * Removes the message listener (important for cleanup in useEffect).
 */
export const offMessage = () => {
  // TODO: if (socket) socket.off('receiveMessage');
  console.log('[socketService] offMessage() placeholder called');
};
