/**
 * services/chatService.js  (CLIENT-SIDE)
 * ----------------------------------------
 * Handles HTTP requests for fetching and sending messages.
 *
 * IMPORTANT (encryption flow):
 *   - Messages must be AES-ENCRYPTED before calling sendMessage()
 *   - Messages returned by getMessages() are still CIPHERTEXT — decrypt them after fetching
 *   - This service is intentionally "encryption-unaware"; it just moves data
 *
 * What this file does RIGHT NOW:
 *   - Returns mock message data
 *
 * What you will add LATER:
 *   - Use apiRequest() to call real backend endpoints
 */

import { apiRequest } from './api';

// ── Mock data (replace with real API calls later) ──────────────────────────
const MOCK_MESSAGES = [
  {
    id: 'msg-001',
    sender: 'alice',
    ciphertext: 'encrypted-content-placeholder',
    iv: 'iv-placeholder',
    timestamp: '2024-01-01T10:00:00Z',
  },
  {
    id: 'msg-002',
    sender: 'bob',
    ciphertext: 'encrypted-content-placeholder',
    iv: 'iv-placeholder',
    timestamp: '2024-01-01T10:01:00Z',
  },
];

/**
 * getMessages()
 * Fetches all messages for the current user from the backend.
 *
 * @returns {Promise<Array>} - Array of encrypted message objects
 *
 * DECRYPTION NOTE:
 *   After fetching, call aes.decryptMessage(msg.ciphertext, msg.iv, sharedKey)
 *   for each message. Do that in the component or a custom hook — not here.
 */
export const getMessages = async () => {
  console.log('[chatService] getMessages() placeholder called');

  // TODO: return await apiRequest('GET', '/messages');

  return MOCK_MESSAGES;
};

/**
 * sendMessage()
 * Sends an already-encrypted message to the backend.
 *
 * @param {string} ciphertext  - AES-encrypted content (from aes.encryptMessage)
 * @param {string} iv          - AES initialization vector
 * @param {string} recipientId - The recipient's user ID
 * @returns {Promise<object>}  - The saved message object
 *
 * ENCRYPTION NOTE:
 *   Encrypt the message BEFORE calling this function.
 *   Call sequence: encryptMessage(plaintext, sharedKey) → sendMessage(ciphertext, iv, recipientId)
 */
export const sendMessage = async (ciphertext, iv, recipientId) => {
  console.log('[chatService] sendMessage() placeholder called');

  // TODO: return await apiRequest('POST', '/messages', { ciphertext, iv, recipientId });

  return {
    id: `msg-${Date.now()}`,
    ciphertext,
    iv,
    recipientId,
    timestamp: new Date().toISOString(),
  };
};
