import { useState, useEffect, useRef } from 'react';
import * as aes from '../crypto/aes';
import * as socketService from '../services/socketService';
import { getMessages as fetchMessages } from '../services/chatService';

/**
 * useMessages(sharedKey, contact, currentUser)
 *
 * Manages the full message lifecycle for an active conversation:
 *  - Loads history from the API and decrypts each message
 *  - Registers socket listeners for real-time incoming messages
 *  - Encrypts outgoing messages and emits them via socket
 */
const useMessages = (sharedKey, contact, currentUser) => {
  const [messages,  setMessages]  = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping,  setIsTyping]  = useState(false); // the other person is typing
  const typingTimeout = useRef(null);

  // ── Helper: format a raw DB message for display ─────────────────────────
  const formatMsg = (raw, decryptedText) => {
    const isFromContact = raw.sender === contact?._id;
    return {
      _id:       raw._id,
      sender:    raw.sender,
      senderName: isFromContact ? contact.username : 'You',
      text:      decryptedText,
      timestamp: new Date(raw.createdAt || Date.now()).toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit',
      }),
    };
  };

  // ── Load history whenever the selected contact changes ──────────────────
  useEffect(() => {
    if (!contact || !sharedKey) {
      setMessages([]);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      try {
        const raw = await fetchMessages(contact._id);
        const decrypted = await Promise.all(
          raw.map(async (msg) => {
            try {
              const text = await aes.decryptMessage(msg.ciphertext, msg.iv, sharedKey);
              return formatMsg(msg, text);
            } catch {
              return formatMsg(msg, '[Could not decrypt]');
            }
          })
        );
        setMessages(decrypted);
      } catch (err) {
        console.error('[useMessages] Failed to load history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [contact?._id, sharedKey]);

  // ── Register socket listeners ────────────────────────────────────────────
  useEffect(() => {
    if (!sharedKey || !contact) return;

    // Incoming message from the other person
    const handleReceive = async (payload) => {
      // Only process messages from the currently active contact
      if (payload.sender !== contact._id) return;

      try {
        const text = await aes.decryptMessage(payload.ciphertext, payload.iv, sharedKey);
        setMessages((prev) => [
          ...prev,
          formatMsg({ ...payload, createdAt: payload.createdAt || new Date().toISOString() }, text),
        ]);
      } catch {
        setMessages((prev) => [...prev, formatMsg(payload, '[Could not decrypt]')]);
      }
    };

    // Echo-back: the server confirmed our sent message was saved
    const handleSent = async (payload) => {
      // The optimistic message is already in state; do nothing (avoid duplicate)
      // If you want server-confirmed replacement, implement deduplication by _id here
    };

    // Typing indicators
    const handleTyping    = ({ senderId }) => { if (senderId === contact._id) setIsTyping(true);  };
    const handleStopTyping = ({ senderId }) => { if (senderId === contact._id) setIsTyping(false); };

    socketService.onMessage(handleReceive);
    socketService.onMessageSent(handleSent);
    socketService.onTyping(handleTyping);
    socketService.onStopTyping(handleStopTyping);

    return () => {
      socketService.offMessage();
      socketService.offMessageSent();
      socketService.offTyping();
      clearTimeout(typingTimeout.current);
    };
  }, [sharedKey, contact?._id]);

  // ── Send a message ────────────────────────────────────────────────────────
  const handleSendMessage = async (text) => {
    if (!text.trim() || !sharedKey || !contact) return;

    try {
      const { ciphertext, iv } = await aes.encryptMessage(text, sharedKey);

      // Optimistically add to UI immediately using the same format as real messages
      const optimisticRaw = {
        _id:       `opt-${Date.now()}`,
        sender:    currentUser?._id || currentUser?.id,
        createdAt: new Date().toISOString(),
      };
      const optimistic = formatMsg(optimisticRaw, text);
      
      setMessages((prev) => [...prev, optimistic]);

      // Emit via socket (server will save + forward to recipient)
      socketService.sendMessage({ receiverId: contact._id, ciphertext, iv });

      // Stop typing indicator
      socketService.emitStopTyping(contact._id);
    } catch (err) {
      console.error('[useMessages] Encryption/send failed:', err);
    }
  };

  // ── Typing indicator emit ────────────────────────────────────────────────
  const handleTypingInput = () => {
    if (!contact) return;
    socketService.emitTyping(contact._id);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socketService.emitStopTyping(contact._id);
    }, 2000);
  };

  return { messages, handleSendMessage, handleTypingInput, isLoading, isTyping };
};

export default useMessages;
