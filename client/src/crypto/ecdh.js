/**
 * crypto/ecdh.js  (CLIENT-SIDE)
 * ------------------------------
 * Placeholder for Elliptic Curve Diffie-Hellman key exchange logic on the browser.
 *
 * ── Client's role in ECDH ────────────────────────────────────────────────
 * The client is responsible for ALL key operations:
 *   1. Generate an ECDH key pair (publicKey + privateKey) on app startup
 *   2. Send publicKey to the server so other users can retrieve it
 *   3. When starting a chat with someone, fetch THEIR publicKey from the server
 *   4. Compute the sharedSecret using (myPrivateKey + theirPublicKey)
 *   5. Derive an AES key from the sharedSecret (using SHA-256 hash)
 *   6. Use that AES key to encrypt/decrypt messages (see aes.js)
 *
 * !! DO NOT IMPLEMENT !! — This is a placeholder only.
 *
 * Implementation will use the Web Crypto API (built into all modern browsers):
 *   window.crypto.subtle.generateKey(...)
 *   window.crypto.subtle.deriveBits(...)
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
 * generateKeyPair()
 * Generates an ECDH P-256 key pair for this user session.
 *
 * @returns {Promise<{ publicKey: CryptoKey, privateKey: CryptoKey }>}
 */
export const generateKeyPair = async () => {
  const crypto = window.crypto || window.msCrypto;
  if (!crypto || !crypto.subtle) {
    throw new Error('Cryptography API is unavailable. This usually happens when the site is not served over HTTPS or localhost (Secure Context).');
  }

  const keyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true, // extractable so we can export both public and private keys
    ['deriveKey', 'deriveBits']
  );
  return keyPair;
};

/**
 * exportPublicKey()
 * Exports a CryptoKey to a base64 string so it can be sent to the server.
 *
 * @param {CryptoKey} publicKey
 * @returns {Promise<string>} - Base64-encoded public key
 */
export const exportPublicKey = async (publicKey) => {
  const crypto = window.crypto || window.msCrypto;
  const exported = await crypto.subtle.exportKey('raw', publicKey);
  return bufferToBase64(exported);
};

/**
 * importPublicKey()
 * Converts a base64 public key string (from the server) back into a CryptoKey.
 *
 * @param {string} base64Key - The other user's public key as a base64 string
 * @returns {Promise<CryptoKey>}
 */
export const importPublicKey = async (base64Key) => {
  const crypto = window.crypto || window.msCrypto;
  const raw = base64ToBuffer(base64Key);
  return await crypto.subtle.importKey(
    'raw', raw, { name: 'ECDH', namedCurve: 'P-256' }, true, []
  );
};

/**
 * deriveSharedKey()
 * Computes the shared AES key from my private key and the other user's public key.
 *
 * @param {CryptoKey} myPrivateKey       - This user's private ECDH key
 * @param {CryptoKey} theirPublicKey     - The other user's imported public key
 * @returns {Promise<CryptoKey>}         - An AES-GCM key ready for encryption
 */
export const deriveSharedKey = async (myPrivateKey, theirPublicKey) => {
  const crypto = window.crypto || window.msCrypto;
  return await crypto.subtle.deriveKey(
    { name: 'ECDH', public: theirPublicKey },
    myPrivateKey,
    { name: 'AES-GCM', length: 256 },
    false, // not extractable
    ['encrypt', 'decrypt']
  );
};

/**
 * exportPrivateKey()
 * Exports a private CryptoKey to a base64 string for local storage.
 *
 * @param {CryptoKey} privateKey
 * @returns {Promise<string>} - Base64-encoded private key
 */
export const exportPrivateKey = async (privateKey) => {
  const crypto = window.crypto || window.msCrypto;
  const exported = await crypto.subtle.exportKey('pkcs8', privateKey);
  return bufferToBase64(exported);
};

/**
 * importPrivateKey()
 * Converts a base64 private key string back into a CryptoKey.
 *
 * @param {string} base64Key
 * @returns {Promise<CryptoKey>}
 */
export const importPrivateKey = async (base64Key) => {
  const crypto = window.crypto || window.msCrypto;
  const raw = base64ToBuffer(base64Key);
  return await crypto.subtle.importKey(
    'pkcs8', raw, { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey', 'deriveBits']
  );
};
