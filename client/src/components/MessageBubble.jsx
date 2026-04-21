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
          <span className="msg-lock" title="End-to-end encrypted">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateY(1px)' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </span>
          <span className="msg-time">{message.timestamp}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
