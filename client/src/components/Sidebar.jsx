import React from 'react';

const AVATAR_COLORS = [
  'linear-gradient(135deg, #6366F1, #3B82F6)', /* Indigo to Blue */
  'linear-gradient(135deg, #EC4899, #8B5CF6)', /* Pink to Purple */
  'linear-gradient(135deg, #10B981, #059669)', /* Emerald */
  'linear-gradient(135deg, #F59E0B, #D97706)', /* Amber */
  'linear-gradient(135deg, #00E5FF, #00B8D4)', /* Electric Cyan */
];
const getColor = (name = '') => AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const Sidebar = ({ contacts, selectedContact, onSelectContact, currentUser, onLogout }) => {
  return (
    <aside className="sidebar">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div>
            <div className="sidebar-brand-name">SecureChat</div>
            <div className="sidebar-brand-user">@{currentUser?.username || 'you'}</div>
          </div>
        </div>
      </div>

      {/* ── Search ─────────────────────────────────────────────────── */}
      <div className="sidebar-search-wrap">
        <input type="text" className="sidebar-search" placeholder="Search contacts…" />
      </div>

      {/* ── Section Label ──────────────────────────────────────────── */}
      <div className="sidebar-section-label">
        {contacts.length > 0 ? `${contacts.length} contacts` : 'No contacts yet'}
      </div>

      {/* ── Contact List ───────────────────────────────────────────── */}
      <div className="sidebar-contacts">
        {contacts.length === 0 && (
          <div style={{ padding: '20px 16px', color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>
            Register another user to start chatting
          </div>
        )}
        {contacts.map((contact) => {
          const isSelected = selectedContact?._id === contact._id;
          const hasUnread  = contact.unreadCount > 0;
          return (
            <div
              key={contact._id}
              className={`contact-item${isSelected ? ' active' : ''}`}
              onClick={() => onSelectContact(contact)}
            >
              {/* Avatar with online-style dot */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div className="contact-avatar" style={{ background: getColor(contact.username) }}>
                  {(contact.username || '?')[0].toUpperCase()}
                </div>
              </div>

              {/* Name + last-message metadata */}
              <div className="contact-info" style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                  <div className="contact-name">{contact.username}</div>
                  {contact.lastMessageAt && (
                    <div style={{ fontSize: 11, color: hasUnread ? 'var(--accent-primary)' : 'var(--text-muted)', flexShrink: 0, fontWeight: hasUnread ? 600 : 400 }}>
                      {new Date(contact.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                  <div className="contact-last-msg" style={{ color: hasUnread ? 'var(--text-primary)' : undefined, fontWeight: hasUnread ? 500 : undefined }}>
                    {contact.email}
                  </div>
                  {hasUnread && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 20,
                      height: 20,
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '0 5px',
                      flexShrink: 0,
                      boxShadow: '0 0 0 2px rgba(34,197,94,0.25)',
                      animation: 'pulse-badge 2s ease-in-out infinite',
                    }}>
                      {contact.unreadCount > 99 ? '99+' : contact.unreadCount}
                    </span>
                  )}
                </div>
              </div>

              {/* E2EE lock icon */}
              {contact.publicKey && (
                <span title="Secured with ECDH key" style={{ color: 'var(--accent-primary)', flexShrink: 0, opacity: 0.8, marginLeft: 4 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
              )}
            </div>
          );
        })}
      </div>

    </aside>
  );
};

export default Sidebar;
