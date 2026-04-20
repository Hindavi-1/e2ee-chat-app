/**
 * hooks/useMessages.js
 * ---------------------
 * Custom React hook for loading, sending, and receiving chat messages.
 * Keeps message-related logic out of components, making them simpler.
 *
 * What this file does RIGHT NOW:
 *   - Loads mock messages on mount
 *   - Provides placeholder send/receive handlers
 *
 * What you will add LATER:
 *   - Fetch real messages via chatService.getMessages()
 *   - Decrypt each message with aes.decryptMessage() after fetching
 *   - Register socket listener via socketService.onMessage()
 *   - Encrypt outgoing messages with aes.encryptMessage() before sending
 */

import { useState, useEffect } from 'react';

// Mock messages for UI development (replace with real data later)
const INITIAL_MOCK_MESSAGES = [
  { id: 'msg-001', sender: 'alice', text: 'Hey! Is this channel secure?', timestamp: '10:00 AM' },
  { id: 'msg-002', sender: 'You',   text: 'It will be once encryption is added!', timestamp: '10:01 AM' },
  { id: 'msg-003', sender: 'alice', text: 'Cannot wait 🔐', timestamp: '10:02 AM' },
];

/**
 * useMessages()
 * @returns {{ messages, sendMessage, isLoading }}
 */
const useMessages = () => {
  const [messages, setMessages]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Load messages on mount ────────────────────────────────────────────────
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);

      // TODO: const rawMessages = await chatService.getMessages();
      // TODO: Decrypt each message:
      //   const decrypted = await Promise.all(
      //     rawMessages.map(msg => aes.decryptMessage(msg.ciphertext, msg.iv, sharedKey))
      //   );
      // TODO: setMessages(decrypted);

      // Placeholder: use mock data
      setTimeout(() => {
        setMessages(INITIAL_MOCK_MESSAGES);
        setIsLoading(false);
      }, 300);
    };

    loadMessages();

    // ── Register socket listener for incoming messages ──────────────────────
    // TODO: socketService.onMessage(handleReceiveMessage);
    // TODO: return () => socketService.offMessage(); // cleanup on unmount
  }, []);

  // ── Send a message ────────────────────────────────────────────────────────
  /**
   * handleSendMessage()
   * Called when the user submits a new message in ChatWindow.
   *
   * ENCRYPTION NOTE:
   *   Step 1 — Encrypt:  const { ciphertext, iv } = await aes.encryptMessage(text, sharedKey);
   *   Step 2 — Send:     socketService.sendMessage({ ciphertext, iv, recipientId });
   *   Step 3 — Optionally persist via chatService.sendMessage(ciphertext, iv, recipientId);
   *
   * @param {string} text - The plaintext message the user typed
   */
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // TODO: const { ciphertext, iv } = await aes.encryptMessage(text, sharedKey);
    // TODO: socketService.sendMessage({ ciphertext, iv, recipientId });

    // Placeholder: add to local state directly (no encryption, no server)
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // ── Receive a message ─────────────────────────────────────────────────────
  /**
   * handleReceiveMessage()
   * Called by the socket listener when a new message arrives from the server.
   *
   * DECRYPTION NOTE:
   *   const plaintext = await aes.decryptMessage(payload.ciphertext, payload.iv, sharedKey);
   *
   * @param {object} payload - { ciphertext, iv, from, timestamp }
   */
  const handleReceiveMessage = async (payload) => {
    // TODO: const plaintext = await aes.decryptMessage(payload.ciphertext, payload.iv, sharedKey);

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: payload.from || 'Unknown',
      text: payload.ciphertext, // TODO: replace with decrypted plaintext
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return { messages, handleSendMessage, handleReceiveMessage, isLoading };
};

export default useMessages;
