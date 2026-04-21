import React from 'react';

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`msg-row ${isOwn ? 'own' : 'other'}`}>
      <div className={`msg-bubble ${isOwn ? 'own' : 'other'}`}>
        {/* Sender name — only for incoming messages */}
        {!isOwn && message.senderName && (
          <div className="msg-sender">{message.senderName}</div>
        )}

        {/* Message text */}
        <div className="msg-text">{message.text}</div>

        {/* Timestamp + lock icon to signify E2EE */}
        <div className="msg-meta">
          <span className="msg-lock" title="End-to-end encrypted">🔒</span>
          <span className="msg-time">{message.timestamp}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
