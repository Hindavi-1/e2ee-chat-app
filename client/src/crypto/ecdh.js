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
 * generateKeyPair()
 * Generates an ECDH P-256 key pair for this user session.
 *
 * @returns {Promise<{ publicKey: CryptoKey, privateKey: CryptoKey }>}
 */
export const generateKeyPair = async () => {
  // TODO: Implement using Web Crypto API:
  // const keyPair = await window.crypto.subtle.generateKey(
  //   { name: 'ECDH', namedCurve: 'P-256' },
  //   true,           // extractable — so we can export the public key to share it
  //   ['deriveKey', 'deriveBits']
  // );
  // return keyPair;  // { publicKey, privateKey }

  console.log('[ecdh.js] generateKeyPair() — placeholder, not implemented');
  return { publicKey: 'placeholder-public-key', privateKey: 'placeholder-private-key' };
};

/**
 * exportPublicKey()
 * Exports a CryptoKey to a base64 string so it can be sent to the server.
 *
 * @param {CryptoKey} publicKey
 * @returns {Promise<string>} - Base64-encoded public key
 */
export const exportPublicKey = async (publicKey) => {
  // TODO: Implement:
  // const exported = await window.crypto.subtle.exportKey('raw', publicKey);
  // return btoa(String.fromCharCode(...new Uint8Array(exported)));

  console.log('[ecdh.js] exportPublicKey() — placeholder, not implemented');
  return 'placeholder-exported-public-key';
};

/**
 * importPublicKey()
 * Converts a base64 public key string (from the server) back into a CryptoKey.
 *
 * @param {string} base64Key - The other user's public key as a base64 string
 * @returns {Promise<CryptoKey>}
 */
export const importPublicKey = async (base64Key) => {
  // TODO: Implement:
  // const raw = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
  // return await window.crypto.subtle.importKey(
  //   'raw', raw, { name: 'ECDH', namedCurve: 'P-256' }, true, []
  // );

  console.log('[ecdh.js] importPublicKey() — placeholder, not implemented');
  return 'placeholder-imported-key';
};

/**
 * deriveSharedKey()
 * Computes the shared AES key from my private key and the other user's public key.
 * This AES key is what actually encrypts/decrypts messages.
 *
 * @param {CryptoKey} myPrivateKey       - This user's private ECDH key
 * @param {CryptoKey} theirPublicKey     - The other user's imported public key
 * @returns {Promise<CryptoKey>}         - An AES-GCM key ready for encryption
 */
export const deriveSharedKey = async (myPrivateKey, theirPublicKey) => {
  // TODO: Implement:
  // return await window.crypto.subtle.deriveKey(
  //   { name: 'ECDH', public: theirPublicKey },
  //   myPrivateKey,
  //   { name: 'AES-GCM', length: 256 },
  //   false,          // not extractable — the raw key bytes stay inside the browser
  //   ['encrypt', 'decrypt']
  // );

  console.log('[ecdh.js] deriveSharedKey() — placeholder, not implemented');
  return 'placeholder-shared-aes-key';
};
