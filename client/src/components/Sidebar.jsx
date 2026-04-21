import React from 'react';

const AVATAR_COLORS = [
  'linear-gradient(135deg,#1d4ed8,#2563eb)',
  'linear-gradient(135deg,#7c3aed,#9333ea)',
  'linear-gradient(135deg,#0e7490,#0891b2)',
  'linear-gradient(135deg,#be185d,#db2777)',
  'linear-gradient(135deg,#065f46,#059669)',
];
const getColor = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const Sidebar = ({ contacts, selectedContact, onSelectContact, currentUser, onLogout }) => {
  return (
    <aside className="sidebar">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">🔐</div>
          <div>
            <div className="sidebar-brand-name">SecureChat</div>
            <div className="sidebar-brand-user">@{currentUser?.username || 'you'}</div>
          </div>
        </div>
      </div>

      {/* ── Search ────────────────────────────────────────────────── */}
      <div className="sidebar-search-wrap">
        <input type="text" className="sidebar-search" placeholder="Search contacts…" />
      </div>

      {/* ── Section Label ─────────────────────────────────────────── */}
      <div className="sidebar-section-label">
        {contacts.length > 0 ? `${contacts.length} contacts` : 'No contacts yet'}
      </div>

      {/* ── Contact List ──────────────────────────────────────────── */}
      <div className="sidebar-contacts">
        {contacts.length === 0 && (
          <div style={{ padding: '20px 16px', color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>
            Register another user to start chatting
          </div>
        )}
        {contacts.map((contact) => {
          const isSelected = selectedContact?._id === contact._id;
          return (
            <div
              key={contact._id}
              className={`contact-item${isSelected ? ' active' : ''}`}
              onClick={() => onSelectContact(contact)}
            >
              <div className="contact-avatar" style={{ background: getColor(contact.username) }}>
                {(contact.username || '?')[0].toUpperCase()}
              </div>
              <div className="contact-info">
                <div className="contact-name">{contact.username}</div>
                <div className="contact-last-msg">{contact.email}</div>
              </div>
              {contact.publicKey && (
                <span title="Has ECDH key" style={{ fontSize: 11, color: 'var(--green)', flexShrink: 0 }}>🔑</span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-avatar">
          {(currentUser?.username || 'Y')[0].toUpperCase()}
        </div>
        <span className="sidebar-footer-name">@{currentUser?.username || 'you'}</span>
        <button className="sc-btn-ghost" onClick={onLogout} title="Sign out" style={{ flexShrink: 0, fontSize: '11px', padding: '5px 10px' }}>
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
