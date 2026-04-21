import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const AVATAR_COLORS = [
  'linear-gradient(135deg,#1d4ed8,#2563eb)',
  'linear-gradient(135deg,#7c3aed,#9333ea)',
  'linear-gradient(135deg,#0e7490,#0891b2)',
  'linear-gradient(135deg,#be185d,#db2777)',
  'linear-gradient(135deg,#065f46,#059669)',
];
const getColor = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const ChatWindow = ({ contact, messages, onSend, onTyping, currentUser, keyExchangeStatus, isTyping }) => {
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

  /* ── No contact selected ──────────────────────────────────────── */
  if (!contact) {
    return (
      <div className="chat-window chat-empty">
        <div className="chat-empty-icon">💬</div>
        <div className="chat-empty-title">Select a conversation</div>
        <div className="chat-empty-sub">Your messages are end-to-end encrypted</div>
        <div className="enc-badge" style={{ marginTop: 4 }}>🔒 E2E Encrypted</div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
  });

  /* ── Key exchange in progress ─────────────────────────────────── */
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
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="chat-header">
        <div className="chat-header-avatar" style={{ background: getColor(contact.username) }}>
          {(contact.username || '?')[0].toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div className="chat-header-name">{contact.username}</div>
          {encStatusBadge()}
        </div>
        {keyExchangeStatus === 'ready' && <div className="enc-badge">🔒 Encrypted</div>}
      </div>

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
          <div className="msg-row other" style={{ padding: '3px 16px' }}>
            <div className="msg-bubble other" style={{ padding: '10px 16px' }}>
              <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <span style={{ animation: 'typingBounce 1s ease-in-out infinite 0ms',    display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)' }} />
                <span style={{ animation: 'typingBounce 1s ease-in-out infinite 150ms',  display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)' }} />
                <span style={{ animation: 'typingBounce 1s ease-in-out infinite 300ms',  display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)' }} />
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
          ➤
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;
