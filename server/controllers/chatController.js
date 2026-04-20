/**
 * controllers/chatController.js
 * ------------------------------
 * Handles the logic for message-related HTTP requests.
 *
 * What this file does RIGHT NOW:
 *   - Returns dummy message arrays and placeholder save confirmations
 *
 * What you will add LATER:
 *   - Fetch real messages from MongoDB via chatService
 *   - Save incoming (encrypted) messages to the database
 *   - Enforce that only authenticated users can access these routes
 *
 * IMPORTANT (encryption note):
 *   Messages stored in the database will be AES-encrypted on the CLIENT
 *   before being sent here. The server should store the ciphertext as-is
 *   and never attempt to decrypt it. Decryption happens client-side.
 */

const chatService = require("../services/chatService");

/**
 * getMessages()
 * Handles GET /api/messages
 *
 * What will happen here later:
 *   1. Extract the authenticated user from req.user (set by authMiddleware)
 *   2. Call chatService.getMessagesForUser(userId)
 *   3. Return the array of (encrypted) message objects
 */
const getMessages = async (req, res) => {
  try {
    // TODO: Get userId from req.user.id (populated by JWT middleware)
    // TODO: Call chatService.getMessagesForUser(userId)

    // ── Dummy data (replace with real DB query later) ──────────────────────
    const dummyMessages = [
      {
        id: "msg-001",
        sender: "alice",
        ciphertext: "<encrypted-payload-will-go-here>",
        timestamp: new Date().toISOString(),
      },
      {
        id: "msg-002",
        sender: "bob",
        ciphertext: "<encrypted-payload-will-go-here>",
        timestamp: new Date().toISOString(),
      },
    ];

    res.status(200).json({ messages: dummyMessages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * sendMessage()
 * Handles POST /api/messages
 *
 * Expected request body:
 *   { ciphertext: string, recipientId: string }
 *   NOTE: The message content arrives already AES-encrypted from the client.
 *
 * What will happen here later:
 *   1. Extract sender from req.user.id
 *   2. Call chatService.saveMessage(sender, recipientId, ciphertext)
 *   3. Return the saved message document
 */
const sendMessage = async (req, res) => {
  try {
    const { ciphertext, recipientId } = req.body;

    // TODO: Get senderId from req.user.id (set by authMiddleware)
    // TODO: Call chatService.saveMessage(senderId, recipientId, ciphertext)
    // NOTE: Never log or inspect the ciphertext — the server should treat it as opaque data

    // ── Placeholder response ───────────────────────────────────────────────
    res.status(201).json({
      message: "sendMessage() placeholder — message not really saved",
      received: { ciphertext, recipientId },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMessages, sendMessage };
