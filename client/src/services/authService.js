/**
 * services/authService.js  (CLIENT-SIDE)
 * ----------------------------------------
 * Handles authentication API calls: register and login.
 *
 * What this file does RIGHT NOW:
 *   - Returns mock responses without making real network requests
 *
 * What you will add LATER:
 *   - Call the real backend via apiRequest() from api.js
 *   - On successful login, store the JWT token (in memory or context — NOT localStorage for security)
 *   - On register, trigger ECDH key generation and send publicKey to server
 */

import { apiRequest } from './api';

/**
 * register()
 * Sends a registration request to the backend.
 *
 * What will happen here later:
 *   1. Call apiRequest('POST', '/auth/register', { username, password })
 *   2. Generate an ECDH key pair for this user (see crypto/ecdh.js)
 *   3. Send the public key to the server so others can encrypt messages to this user
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} - { user, token }
 */
export const register = async (username, password) => {
  console.log('[authService] register() placeholder called');

  // TODO: const response = await apiRequest('POST', '/auth/register', { username, password });
  // TODO: Generate ECDH key pair and store privateKey securely in memory/context
  // TODO: Send publicKey to server

  // ── Mock response ──────────────────────────────────────────────────────
  return {
    user: { id: 'mock-user-id', username },
    token: 'mock-jwt-token',
  };
};

/**
 * login()
 * Sends a login request to the backend.
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} - { user, token }
 */
export const login = async (username, password) => {
  console.log('[authService] login() placeholder called');

  // TODO: const response = await apiRequest('POST', '/auth/login', { username, password });
  // TODO: Store the returned token for use in subsequent API requests
  // TODO: Re-derive ECDH keys (or load from secure storage if persisted)

  // ── Mock response ──────────────────────────────────────────────────────
  return {
    user: { id: 'mock-user-id', username },
    token: 'mock-jwt-token',
  };
};

/**
 * logout()
 * Clears the user's session data from memory.
 */
export const logout = () => {
  // TODO: Clear JWT token from memory / context
  // TODO: Destroy ECDH private key from memory
  // TODO: Redirect to /login
  console.log('[authService] logout() placeholder called');
};
