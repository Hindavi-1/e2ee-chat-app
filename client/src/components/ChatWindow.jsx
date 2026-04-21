import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const AVATAR_COLORS = [
  'linear-gradient(135deg, #6366F1, #3B82F6)', /* Indigo to Blue */
  'linear-gradient(135deg, #EC4899, #8B5CF6)', /* Pink to Purple */
  'linear-gradient(135deg, #10B981, #059669)', /* Emerald */
  'linear-gradient(135deg, #F59E0B, #D97706)', /* Amber */
  'linear-gradient(135deg, #00E5FF, #00B8D4)', /* Electric Cyan */
];
const getColor = (name = '') => AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const ChatWindow = ({ contact, messages, onSend, onTyping, currentUser, keyExchangeStatus, isTyping, onLogout }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = () => {
    if (!inputText.trim() || keyExchangeStatus !== 'ready') return;
    onSend(inputText);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    setInputText(e.target.value);
    if (onTyping) onTyping();
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
  });

  const encStatusBadge = () => {
    if (keyExchangeStatus === 'loading') return (
      <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
        Establishing secure channel…
      </span>
    );
    if (keyExchangeStatus === 'error') return (
      <span style={{ fontSize: 11, color: 'var(--danger)' }}>⚠ Key exchange failed — re-login to fix</span>
    );
    return <div className="chat-header-status">End-to-end encrypted</div>;
  };

  const isInputDisabled = keyExchangeStatus !== 'ready';

  return (
    <div className="chat-window">
      {/* ── Header (Always Visible) ─────────────────────────────────── */}
      <div className="chat-header">
        <div className="chat-header-info">
          {contact ? (
            <>
              <div className="chat-header-avatar" style={{ background: getColor(contact.username) }}>
                {(contact.username || '?')[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div className="chat-header-name">{contact.username}</div>
                {encStatusBadge()}
              </div>
            </>
          ) : (
            <div className="chat-header-name" style={{ color: 'var(--text-muted)' }}>SecureChat</div>
          )}
        </div>

        {/* ── Top Right User Profile ────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {contact && keyExchangeStatus === 'ready' && (
            <div className="enc-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Encrypted
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '16px' }}>
            <div className="sidebar-footer-avatar" style={{ width: 32, height: 32, fontSize: 13 }} title={currentUser?.email}>
              {(currentUser?.username || 'Y')[0].toUpperCase()}
            </div>
            <button className="sc-btn-ghost" onClick={onLogout} title="Sign out" style={{ fontSize: '11px', padding: '5px 10px' }}>
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Area ───────────────────────────────────────────────── */}
      {!contact ? (
        <div className="chat-empty">
          <div className="chat-empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)' }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div className="chat-empty-title">Select a conversation</div>
          <div className="chat-empty-sub">Your messages are end-to-end encrypted</div>
        </div>
      ) : (
        <>
          {/* ── Message List ──────────────────────────────────────────── */}
          <div className="chat-messages">
            <div className="chat-date-divider"><span>{today}</span></div>

            {messages.length === 0 && keyExchangeStatus === 'ready' ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px', fontSize: '14px' }}>
                No messages yet. Say hi! 👋
              </div>
            ) : null}

            {messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                isOwn={
                  msg.sender === (currentUser?._id || currentUser?.id) ||
                  msg.sender === currentUser?.username ||
                  msg.sender === 'You'
                }
              />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="msg-row other" style={{ padding: '0 8px' }}>
                <div className="msg-bubble other" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center' }}>
                  <span className="typing-dots">
                    <span></span><span></span><span></span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input Area ────────────────────────────────────────────── */}
          <div className="chat-input-area">
            <textarea
              value={inputText}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={isInputDisabled ? 'Establishing secure channel…' : 'Type a message… (Enter to send)'}
              rows={1}
              disabled={isInputDisabled}
              className="chat-textarea"
              style={{ opacity: isInputDisabled ? 0.5 : 1 }}
            />
            <button
              onClick={handleSubmit}
              disabled={!inputText.trim() || isInputDisabled}
              className={`chat-send-btn ${inputText.trim() && !isInputDisabled ? 'active' : 'inactive'}`}
              title="Send encrypted message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(-1px) translateY(1px)' }}>
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ChatWindow;
