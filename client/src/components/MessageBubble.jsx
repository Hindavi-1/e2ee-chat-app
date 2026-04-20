/**
 * components/MessageBubble.jsx
 * -----------------------------
 * Renders a single chat message bubble.
 * Visually differentiates between messages sent by "You" vs others.
 *
 * Props:
 *   - message  : { id, sender, text, timestamp }
 *   - isOwn    : boolean — true if this message was sent by the current user
 *
 * What you will add LATER:
 *   - Show a lock icon or "encrypted" badge
 *   - Display decryption status (e.g. if decryption fails, show a warning)
 *   - Support different message types (images, files) beyond plain text
 */

import React from 'react';

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: isOwn ? 'flex-end' : 'flex-start',
      marginBottom: '10px',
      padding: '0 16px',
    }}>
      <div style={{
        maxWidth: '70%',
        padding: '10px 14px',
        borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        backgroundColor: isOwn ? '#2563eb' : '#1e293b',
        color: '#f1f5f9',
        fontSize: '14px',
        lineHeight: '1.5',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }}>
        {/* Sender name — only shown for messages from others */}
        {!isOwn && (
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
            {message.sender}
          </div>
        )}

        {/* Message text */}
        {/* TODO: This will be the AES-DECRYPTED plaintext once crypto is implemented */}
        <div>{message.text}</div>

        {/* Timestamp */}
        <div style={{
          fontSize: '10px',
          color: isOwn ? '#bfdbfe' : '#64748b',
          marginTop: '4px',
          textAlign: 'right',
        }}>
          {message.timestamp}
          {/* TODO: Add a lock icon here to indicate the message was encrypted */}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
