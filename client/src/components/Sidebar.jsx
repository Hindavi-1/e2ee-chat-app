/**
 * components/Sidebar.jsx
 * -----------------------
 * Displays the list of contacts / conversations.
 * Selecting a contact loads their chat history in ChatWindow.
 *
 * Props:
 *   - contacts        : Array of { id, username, lastMessage, unread }
 *   - selectedContact : The currently selected contact object
 *   - onSelectContact : Callback when a contact is clicked
 *   - currentUsername : The logged-in user's username (for display)
 *   - onLogout        : Callback for the logout button
 *
 * What you will add LATER:
 *   - Fetch real contacts from the backend
 *   - Show online/offline status indicators
 *   - Trigger ECDH key exchange when a new contact is selected:
 *       1. Fetch their publicKey from the server
 *       2. Call ecdh.deriveSharedKey(myPrivateKey, theirPublicKey)
 *       3. Store the sharedKey for this conversation
 */

import React from 'react';

// Mock contact list for UI development (replace with real API data later)
const MOCK_CONTACTS = [
  { id: 'user-alice', username: 'alice',   lastMessage: 'Cannot wait 🔐',   unread: 0 },
  { id: 'user-bob',   username: 'bob',     lastMessage: 'Are we encrypted?', unread: 2 },
  { id: 'user-carol', username: 'carol',   lastMessage: 'Hello there!',      unread: 0 },
];

const Sidebar = ({ selectedContact, onSelectContact, currentUsername, onLogout }) => {
  const contacts = MOCK_CONTACTS; // TODO: Replace with real contacts from API/context

  return (
    <aside style={{
      width: '280px',
      minWidth: '280px',
      backgroundColor: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #1e293b',
    }}>
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            🔐 SecureChat
          </div>
          <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>
            @{currentUsername || 'you'}
          </div>
        </div>
        <button
          onClick={onLogout}
          title="Logout"
          style={{
            background: 'none',
            border: '1px solid #334155',
            borderRadius: '6px',
            color: '#64748b',
            cursor: 'pointer',
            padding: '4px 10px',
            fontSize: '12px',
          }}
        >
          Out
        </button>
      </div>

      {/* ── Search Bar (placeholder) ───────────────────────────────────────── */}
      <div style={{ padding: '12px 16px' }}>
        <input
          type="text"
          placeholder="Search contacts..."
          style={{
            width: '100%',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#f1f5f9',
            fontSize: '13px',
            padding: '8px 12px',
            boxSizing: 'border-box',
            outline: 'none',
          }}
          // TODO: Implement contact search/filter
        />
      </div>

      {/* ── Contact List ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {contacts.map((contact) => {
          const isSelected = selectedContact?.id === contact.id;
          return (
            <div
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#1e293b' : 'transparent',
                borderLeft: isSelected ? '3px solid #38bdf8' : '3px solid transparent',
                transition: 'background 0.15s',
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '40px', height: '40px',
                borderRadius: '50%',
                backgroundColor: '#1d4ed8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: '16px',
                flexShrink: 0,
              }}>
                {contact.username[0].toUpperCase()}
              </div>

              {/* Contact Info */}
              <div style={{ marginLeft: '12px', flex: 1, minWidth: 0 }}>
                <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '14px' }}>
                  {contact.username}
                </div>
                <div style={{
                  color: '#64748b', fontSize: '12px',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {/* TODO: This will show the DECRYPTED preview of the last message */}
                  {contact.lastMessage}
                </div>
              </div>

              {/* Unread Badge */}
              {contact.unread > 0 && (
                <div style={{
                  backgroundColor: '#38bdf8',
                  color: '#0f172a',
                  borderRadius: '50%',
                  width: '20px', height: '20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700, flexShrink: 0,
                }}>
                  {contact.unread}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
