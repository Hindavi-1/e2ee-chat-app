import { useState, useEffect, useRef, useCallback } from 'react';
import * as aes from '../crypto/aes';
import * as socketService from '../services/socketService';
import { getMessages as fetchMessages } from '../services/chatService';

/**
 * useMessages(sharedKey, contact, currentUser, onContactActivity)
 *
 * Manages the full message lifecycle for an active conversation:
 *  - Loads history from the API and decrypts each message
 *  - Registers socket listeners for real-time incoming messages
 *  - Encrypts outgoing messages and emits them via socket
 *  - Tracks message status: 'sent' → 'delivered' → 'seen'
 *  - Emits read receipts (delivered/seen) automatically
 */
const useMessages = (sharedKey, contact, currentUser, onContactActivity) => {
  const [messages,  setMessages]  = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping,  setIsTyping]  = useState(false);
  const typingTimeout = useRef(null);
  const contactRef    = useRef(contact);

  // Keep contactRef in sync so socket handlers always see the latest contact
  useEffect(() => { contactRef.current = contact; }, [contact]);

  // ── Helper: format a raw DB message for display ────────────────────────
  const formatMsg = (raw, decryptedText) => {
    const isFromContact = raw.sender === contact?._id || raw.sender?.toString() === contact?._id?.toString();
    return {
      _id:        raw._id,
      sender:     raw.sender,
      senderName: isFromContact ? contact.username : 'You',
      text:       decryptedText,
      status:     raw.status || 'sent',
      timestamp:  new Date(raw.createdAt || Date.now()).toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit',
      }),
    };
  };

  // ── Load history whenever the selected contact changes ─────────────────
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
            } catch (err) {
              console.warn(`[useMessages] Decryption failed for history msg ${msg._id}:`, err);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact?._id, sharedKey]);

  // ── Mark all messages from contact as seen when chat is opened ─────────
  useEffect(() => {
    if (!contact || !sharedKey) return;
    socketService.emitMessagesSeen(contact._id);
  }, [contact?._id, sharedKey]);

  // ── Register socket listeners ──────────────────────────────────────────
  useEffect(() => {
    if (!sharedKey || !contact) return;

    // Incoming message from the other person
    const handleReceive = async (payload) => {
      const activeContact = contactRef.current;

      // Always auto-emit delivered so sender's tick updates regardless of active chat
      socketService.emitMessageDelivered(payload._id, payload.sender);

      // If the message is from the currently active contact, mark as seen immediately
      if (payload.sender === activeContact?._id || payload.sender?.toString() === activeContact?._id?.toString()) {
        socketService.emitMessagesSeen(payload.sender);
      } else {
        // Message from a different contact — notify Chat.jsx for sidebar badge
        onContactActivity?.(payload.sender, new Date(payload.createdAt || Date.now()).toISOString());
        return; // Don't append to current chat view
      }

      try {
        const text = await aes.decryptMessage(payload.ciphertext, payload.iv, sharedKey);
        setMessages((prev) => [
          ...prev,
          formatMsg({ ...payload, createdAt: payload.createdAt || new Date().toISOString() }, text),
        ]);
      } catch (err) {
        console.warn(`[useMessages] Decryption failed for incoming msg ${payload._id}:`, err);
        setMessages((prev) => [...prev, formatMsg(payload, '[Could not decrypt]')]);
      }
    };

    // Echo-back: server confirmed our sent message was saved
    const handleSent = (payload) => {
      // Replace the optimistic message (opt-*) with the server-confirmed one if present
      // Otherwise, just update the status of matching _id
      setMessages((prev) => {
        // Find the latest optimistic message and replace it
        const lastOptIdx = [...prev].reverse().findIndex((m) => m._id?.toString().startsWith('opt-'));
        if (lastOptIdx !== -1) {
          const realIdx = prev.length - 1 - lastOptIdx;
          const updated = [...prev];
          updated[realIdx] = { ...updated[realIdx], _id: payload._id, status: 'sent' };
          return updated;
        }
        return prev;
      });
    };

    // Update tick status when recipient has delivered
    const handleDelivered = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id?.toString() === messageId?.toString() && m.status === 'sent'
            ? { ...m, status: 'delivered' }
            : m
        )
      );
    };

    // Update tick status when recipient has seen all messages
    const handleSeen = ({ receiverId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          (m.status === 'sent' || m.status === 'delivered')
            ? { ...m, status: 'seen' }
            : m
        )
      );
    };

    const handleTyping     = ({ senderId }) => { if (senderId === contact._id) setIsTyping(true);  };
    const handleStopTyping = ({ senderId }) => { if (senderId === contact._id) setIsTyping(false); };

    socketService.onMessage(handleReceive);
    socketService.onMessageSent(handleSent);
    socketService.onMessageDelivered(handleDelivered);
    socketService.onMessagesSeen(handleSeen);
    socketService.onTyping(handleTyping);
    socketService.onStopTyping(handleStopTyping);

    return () => {
      socketService.offMessage();
      socketService.offMessageSent();
      socketService.offMessageDelivered();
      socketService.offMessagesSeen();
      socketService.offTyping();
      clearTimeout(typingTimeout.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedKey, contact?._id]);

  // ── Send a message ─────────────────────────────────────────────────────
  const handleSendMessage = async (text) => {
    if (!text.trim() || !sharedKey || !contact) return;

    try {
      const { ciphertext, iv } = await aes.encryptMessage(text, sharedKey);

      // Optimistic message — status starts as 'sent' (1 tick)
      const optimisticRaw = {
        _id:       `opt-${Date.now()}`,
        sender:    currentUser?._id || currentUser?.id,
        createdAt: new Date().toISOString(),
        status:    'sent',
      };
      const optimistic = formatMsg(optimisticRaw, text);
      setMessages((prev) => [...prev, optimistic]);

      // Notify Chat.jsx that we sent a message to this contact (for sidebar sorting)
      onContactActivity?.(contact._id, optimisticRaw.createdAt, true);

      // Emit via socket
      socketService.sendMessage({ receiverId: contact._id, ciphertext, iv });
      socketService.emitStopTyping(contact._id);
    } catch (err) {
      console.error('[useMessages] Encryption/send failed:', err);
    }
  };

  // ── Typing indicator ───────────────────────────────────────────────────
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
