/**
 * crypto/aes.js  (CLIENT-SIDE)
 * -----------------------------
 * Placeholder for AES-GCM encryption and decryption in the browser.
 *
 * ── Where encryption happens in the chat flow ────────────────────────────
 *
 *   SENDING a message:
 *     1. User types a message in ChatWindow.jsx
 *     2. handleSendMessage() calls aes.encrypt(messageText, sharedKey)
 *     3. The resulting { ciphertext, iv } is sent to the server via socketService
 *     4. The server stores it WITHOUT reading the content ✅
 *
 *   RECEIVING a message:
 *     1. socketService receives a "receiveMessage" event from the server
 *     2. handleReceiveMessage() calls aes.decrypt(ciphertext, iv, sharedKey)
 *     3. The decrypted plaintext is displayed in ChatWindow.jsx
 *
 * !! DO NOT IMPLEMENT !! — This is a placeholder only.
 *
 * Implementation will use the Web Crypto API (built into all modern browsers).
 */

/**
 * Helper: Converts ArrayBuffer/Uint8Array to Base64 string robustly.
 */
function bufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Helper: Converts Base64 string to Uint8Array robustly.
 */
function base64ToBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * encryptMessage()
 * Encrypts a plaintext message using AES-GCM.
 *
 * @param {string}    plaintext  - The raw message the user typed
 * @param {CryptoKey} aesKey     - The shared AES key from ECDH key exchange
 * @returns {Promise<{ ciphertext: string, iv: string }>}
 */
export const encryptMessage = async (plaintext, aesKey) => {
  const crypto = window.crypto || window.msCrypto;
  if (!crypto || !crypto.subtle) {
    throw new Error('Cryptography API is unavailable. Ensure you are in a Secure Context (HTTPS or localhost).');
  }

  // Step 1 — Generate a random 96-bit IV (must be unique for every message!)
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Step 2 — Encode the plaintext as bytes
  const encodedText = new TextEncoder().encode(plaintext);
  
  // Step 3 — Encrypt
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    encodedText
  );
  
  // Step 4 — Convert to base64 for JSON transport
  return {
    ciphertext: bufferToBase64(encrypted),
    iv:         bufferToBase64(iv),
  };
};

/**
 * decryptMessage()
 * Decrypts an AES-GCM ciphertext back to readable text.
 *
 * @param {string}    ciphertext - Base64-encoded encrypted message
 * @param {string}    iv         - Base64-encoded initialization vector
 * @param {CryptoKey} aesKey     - The shared AES key from ECDH key exchange
 * @returns {Promise<string>}    - Decrypted plaintext
 */
export const decryptMessage = async (ciphertext, iv, aesKey) => {
  const crypto = window.crypto || window.msCrypto;
  if (!crypto || !crypto.subtle) {
    throw new Error('Cryptography API is unavailable.');
  }

  // Step 1 — Decode from base64 back to bytes
  const ciphertextBytes = base64ToBuffer(ciphertext);
  const ivBytes         = base64ToBuffer(iv);
  
  // Step 2 — Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBytes },
    aesKey,
    ciphertextBytes
  );
  
  // Step 3 — Decode bytes back to a string
  return new TextDecoder().decode(decrypted);
};
