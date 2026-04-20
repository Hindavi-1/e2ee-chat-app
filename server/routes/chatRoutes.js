/**
 * routes/chatRoutes.js
 * --------------------
 * Defines URL paths for message-related endpoints.
 *
 * Registered routes:
 *   GET  /api/messages  →  chatController.getMessages
 *   POST /api/messages  →  chatController.sendMessage
 *
 * What you will add LATER:
 *   - authMiddleware on every route to ensure only logged-in users can access them
 *   - Pagination parameters for GET /api/messages (e.g., ?page=1&limit=50)
 *   - Input validation on POST /api/messages
 */

const express = require("express");
const router = express.Router();
const { getMessages, sendMessage } = require("../controllers/chatController");

// const { protect } = require('../middleware/authMiddleware');
// TODO: Uncomment the line above and add `protect` as middleware once JWT is implemented
// Example: router.get('/', protect, getMessages);

// GET /api/messages
// Retrieves messages for the authenticated user
router.get("/", getMessages);

// POST /api/messages
// Saves a new (encrypted) message
router.post("/", sendMessage);

module.exports = router;
