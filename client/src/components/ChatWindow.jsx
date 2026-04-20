/**
 * components/ChatWindow.jsx
 * --------------------------
 * The main message area: shows the conversation and the message input box.
 *
 * Props:
 *   - contact     : The currently selected contact object { id, username }
 *   - messages    : Array of { id, sender, text, timestamp }
 *   - onSend      : Callback with the plaintext message string
 *   - currentUser : The logged-in user object { id, username }
 *
 * What you will add LATER:
 *   - Show a "🔒 End-to-end encrypted" banner at the top
 *   - Display a loading state while ECDH key exchange completes
 *   - Show a warning if encryption keys are not yet established
 *
 * ENCRYPTION FLOW REMINDER:
 *   onSend(text) in this component calls handleSendMessage() in useMessages.js,
 *   which is where AES encryption will happen before sending to the server.
 */

import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ contact, messages, onSend, currentUser }) => {
  const [inputText, setInputText]   = useState('');
  const messagesEndRef              = useRef(null);

  // Auto-scroll to the latest message whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Called when the user clicks Send or presses Enter
  const handleSubmit = () => {
    if (!inputText.trim()) return;
    onSend(inputText); // TODO: onSend will encrypt this text before transmitting
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // No contact selected — show a placeholder panel
  if (!contact) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        color: '#334155',
        fontSize: '15px',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <div style={{ fontSize: '48px' }}>🔐</div>
        <div>Select a conversation to start chatting</div>
        <div style={{ fontSize: '12px', color: '#1e3a5f' }}>Messages are end-to-end encrypted</div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0f172a',
      overflow: 'hidden',
    }}>
      {/* ── Chat Header ───────────────────────────────────────────────────── */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#0f172a',
      }}>
        {/* Avatar */}
        <div style={{
          width: '36px', height: '36px',
          borderRadius: '50%',
          backgroundColor: '#1d4ed8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700,
        }}>
          {contact.username[0].toUpperCase()}
        </div>
        <div>
          <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '15px' }}>
            {contact.username}
          </div>
          {/* TODO: Show real encryption status here once ECDH key exchange is implemented */}
          <div style={{ color: '#22c55e', fontSize: '11px' }}>🔒 End-to-end encrypted (coming soon)</div>
        </div>
      </div>

      {/* ── Message List ──────────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingTop: '16px',
        paddingBottom: '8px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#334155', marginTop: '40px', fontSize: '14px' }}>
            No messages yet. Say hi! 👋
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender === currentUser?.username || msg.sender === 'You'}
            />
          ))
        )}
        {/* Invisible div at the bottom for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Message Input ─────────────────────────────────────────────────── */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '10px',
        backgroundColor: '#0f172a',
      }}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send)"
          rows={1}
          style={{
            flex: 1,
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '12px',
            color: '#f1f5f9',
            fontSize: '14px',
            padding: '10px 14px',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            lineHeight: '1.5',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!inputText.trim()}
          style={{
            backgroundColor: inputText.trim() ? '#2563eb' : '#1e293b',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            cursor: inputText.trim() ? 'pointer' : 'not-allowed',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'background 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          Send {/* TODO: Show lock icon to indicate message will be encrypted */}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
