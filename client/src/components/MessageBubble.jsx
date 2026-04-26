import React from 'react';

/**
 * StatusTick — renders WhatsApp-style message status icons
 *   sent      → 1 gray tick
 *   delivered → 2 gray ticks
 *   seen      → 2 blue ticks
 */
const StatusTick = ({ status }) => {
  if (!status) return null;

  // 'seen' → bright white so ticks are visible on the blue sender bubble
  // 'delivered' → semi-transparent white
  const color = status === 'seen' ? '#3403f6ff' : 'rgba(201, 194, 194, 0.96)';

  // Single tick (sent)
  if (status === 'sent') {
    return (
      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }} title="Sent">
        <path d="M1 5l3 3 6-7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Double tick (delivered or seen)
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }} title={status === 'seen' ? 'Seen' : 'Delivered'}>
      {/* First tick */}
      <path d="M1 5l3 3 6-7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Second tick (offset right) */}
      <path d="M5 5l3 3 6-7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const MessageBubble = ({ message, isOwn, isGroupChat = false }) => {
  return (
    <div className={`msg-row ${isOwn ? 'own' : 'other'}`}>
      <div className={`msg-bubble ${isOwn ? 'own' : 'other'}`}>
        {/* Sender name — only for incoming messages in group chats */}
        {!isOwn && isGroupChat && message.senderName && (
          <div className="msg-sender">{message.senderName}</div>
        )}

        {/* Message text */}
        <div className="msg-text">{message.text}</div>

        {/* Timestamp + lock icon + status ticks */}
        <div className="msg-meta">
          <span className="msg-lock" title="End-to-end encrypted">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateY(1px)' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </span>
          <span className="msg-time">{message.timestamp}</span>
          {/* Show ticks only on sent messages */}
          {isOwn && (
            <span style={{ marginLeft: 3, lineHeight: 1 }}>
              <StatusTick status={message.status} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
