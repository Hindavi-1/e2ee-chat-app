/**
 * services/api.js
 * Central HTTP client for backend API requests
 */

// Base URL (works in both local + production)
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * apiRequest()
 * @param {string} endpoint - API path (e.g. '/auth/login')
 * @param {string} method   - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} body     - Optional request body
 */
export const apiRequest = async (endpoint, method = "GET", body = null) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/api${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : null,
    });

    // Handle non-JSON responses safely
    let data;
    try {
      data = await response.json();
    } catch {
      data = { message: "Invalid JSON response from server" };
    }

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};