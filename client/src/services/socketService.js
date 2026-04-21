import { io } from 'socket.io-client';

let socket = null;

/**
 * connect() — opens an authenticated Socket.IO connection
 */
export const connect = (token) => {
  if (socket?.connected) return socket;

  socket = io('http://localhost:5000', {
    auth: { token },
    transports: ['websocket'],
  });

  socket.on('connect', () =>
    console.log('[socket] Connected:', socket.id)
  );
  socket.on('connect_error', (err) =>
    console.error('[socket] Connection error:', err.message)
  );

  return socket;
};

/** disconnect() */
export const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * sendMessage() — emits an encrypted message to the server
 * @param {{ receiverId, ciphertext, iv }} payload
 */
export const sendMessage = (payload) => {
  if (socket?.connected) {
    socket.emit('sendMessage', payload);
  } else {
    console.warn('[socket] sendMessage called but socket is not connected');
  }
};

/**
 * onMessage() — register a callback for incoming messages from others
 */
export const onMessage = (callback) => {
  if (socket) socket.on('receiveMessage', callback);
};

/**
 * onMessageSent() — register a callback for the echo-back of your own sent message
 */
export const onMessageSent = (callback) => {
  if (socket) socket.on('messageSent', callback);
};

/** offMessage() — remove the incoming message listener */
export const offMessage = () => {
  if (socket) socket.off('receiveMessage');
};

/** offMessageSent() */
export const offMessageSent = () => {
  if (socket) socket.off('messageSent');
};

/** emitTyping / emitStopTyping */
export const emitTyping = (receiverId) => {
  if (socket?.connected) socket.emit('typing', { receiverId });
};
export const emitStopTyping = (receiverId) => {
  if (socket?.connected) socket.emit('stopTyping', { receiverId });
};

/** onTyping / onStopTyping */
export const onTyping = (cb) => { if (socket) socket.on('typing', cb); };
export const onStopTyping = (cb) => { if (socket) socket.on('stopTyping', cb); };
export const offTyping = () => { if (socket) { socket.off('typing'); socket.off('stopTyping'); } };

export const getSocket = () => socket;
