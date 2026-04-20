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
 * encryptMessage()
 * Encrypts a plaintext message using AES-GCM.
 *
 * @param {string}    plaintext  - The raw message the user typed
 * @param {CryptoKey} aesKey     - The shared AES key from ECDH key exchange
 * @returns {Promise<{ ciphertext: string, iv: string }>}
 */
export const encryptMessage = async (plaintext, aesKey) => {
  // TODO: Implement using Web Crypto API:
  //
  // Step 1 — Generate a random 96-bit IV (must be unique for every message!)
  // const iv = window.crypto.getRandomValues(new Uint8Array(12));
  //
  // Step 2 — Encode the plaintext as bytes
  // const encodedText = new TextEncoder().encode(plaintext);
  //
  // Step 3 — Encrypt
  // const encrypted = await window.crypto.subtle.encrypt(
  //   { name: 'AES-GCM', iv },
  //   aesKey,
  //   encodedText
  // );
  //
  // Step 4 — Convert to base64 for JSON transport
  // return {
  //   ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
  //   iv:         btoa(String.fromCharCode(...iv)),
  // };

  console.log('[aes.js] encryptMessage() — placeholder, not implemented');
  return {
    ciphertext: `encrypted(${plaintext})`,
    iv: 'placeholder-iv',
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
  // TODO: Implement using Web Crypto API:
  //
  // Step 1 — Decode from base64 back to bytes
  // const ciphertextBytes = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
  // const ivBytes         = Uint8Array.from(atob(iv),         c => c.charCodeAt(0));
  //
  // Step 2 — Decrypt
  // const decrypted = await window.crypto.subtle.decrypt(
  //   { name: 'AES-GCM', iv: ivBytes },
  //   aesKey,
  //   ciphertextBytes
  // );
  //
  // Step 3 — Decode bytes back to a string
  // return new TextDecoder().decode(decrypted);

  console.log('[aes.js] decryptMessage() — placeholder, not implemented');
  return `decrypted(${ciphertext})`;
};
