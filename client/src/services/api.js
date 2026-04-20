/**
 * services/api.js
 * ----------------
 * Central HTTP client for all backend API requests.
 * All other service files (authService.js, chatService.js) will import from here.
 *
 * What this file does RIGHT NOW:
 *   - Exports a simple `apiRequest()` helper that logs requests and returns mock data
 *
 * What you will add LATER:
 *   - Install axios: npm install axios
 *   - Create an axios instance with baseURL and default headers
 *   - Add a request interceptor to attach the JWT token to every request:
 *       Authorization: Bearer <token>
 *   - Add a response interceptor to handle 401 errors (redirect to login)
 */

// The base URL of your Express backend
const BASE_URL = 'http://localhost:5000/api';

/**
 * apiRequest()
 * A thin wrapper around fetch() for making HTTP requests.
 *
 * @param {string} method   - HTTP method: 'GET', 'POST', 'PUT', 'DELETE'
 * @param {string} endpoint - API path, e.g. '/auth/login'
 * @param {object} body     - Optional request body (for POST/PUT)
 * @returns {Promise<object>} - The parsed JSON response
//  */
// export const apiRequest = async (method, endpoint, body = null) => {
//   console.log(`[api.js] ${method} ${BASE_URL}${endpoint} — placeholder, no real request made`);

//   // TODO: Replace with a real fetch() or axios call:
//   //
//   // const token = localStorage.getItem('authToken'); // or from context
//   //
//   // const options = {
//   //   method,
//   //   headers: {
//   //     'Content-Type': 'application/json',
//   //     ...(token && { Authorization: `Bearer ${token}` }),
//   //   },
//   //   ...(body && { body: JSON.stringify(body) }),
//   // };
//   //
//   // const response = await fetch(`${BASE_URL}${endpoint}`, options);
//   // if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
//   // return await response.json();

//   // ── Mock response for now ──────────────────────────────────────────────
//   return { success: true, message: `Mock response for ${method} ${endpoint}` };
// };






export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`http://localhost:5000/api${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: body ? JSON.stringify(body) : null
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};