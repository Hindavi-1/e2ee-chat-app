/**
 * pages/Chat.jsx
 * ---------------
 * The main chat interface: Sidebar (contacts) + ChatWindow (messages).
 * This is the page the user sees after logging in.
 *
 * What this file does RIGHT NOW:
 *   - Renders the Sidebar and ChatWindow side by side
 *   - Uses the useMessages hook for mock message data
 *   - Handles contact selection locally
 *
 * What you will add LATER:
 *   - Connect to the socket on mount: socketService.connect(authToken)
 *   - When a contact is selected, perform ECDH key exchange:
 *       1. Fetch their publicKey from GET /api/users/:id/publicKey
 *       2. Call ecdh.deriveSharedKey(myPrivateKey, theirPublicKey)
 *       3. Store the sharedKey in state for the active conversation
 *   - Pass sharedKey to the encryption/decryption calls in useMessages
 *
 * Props:
 *   - currentUser : { id, username } from AuthContext
 *   - onLogout    : Callback to clear auth state and return to Login
 */

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import useMessages from '../hooks/useMessages';

const Chat = ({ currentUser, onLogout }) => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { messages, handleSendMessage, isLoading } = useMessages();

  // ── Initialize chat session ────────────────────────────────────────────────
  useEffect(() => {
    initializeChat();
    // TODO: return () => socketService.disconnect(); // cleanup on unmount
  }, []);

  /**
   * initializeChat()
   * Called once when the Chat page mounts.
   * Sets up the socket connection and prepares encryption keys.
   *
   * What will happen here later:
   *   1. Connect to Socket.IO: socketService.connect(authToken)
   *   2. Generate (or restore) the user's ECDH key pair
   */
  const initializeChat = async () => {
    console.log('[Chat.jsx] initializeChat() — placeholder');
    // TODO: socketService.connect(authToken);
    // TODO: const { publicKey, privateKey } = await ecdh.generateKeyPair();
    // Store privateKey in component state or context — never send it anywhere
  };

  /**
   * handleSelectContact()
   * Called when the user clicks a contact in the Sidebar.
   * This is where ECDH key exchange will happen.
   *
   * @param {object} contact - { id, username, publicKey }
   */
  const handleSelectContact = async (contact) => {
    setSelectedContact(contact);
    setMobileSidebarOpen(false);

    // ECDH KEY EXCHANGE — happens here in the future:
    // 1. Fetch their public key from the server:
    //    const { publicKey: theirPublicKey } = await apiRequest('GET', `/users/${contact.id}/publicKey`);
    // 2. Import it as a CryptoKey:
    //    const importedKey = await ecdh.importPublicKey(theirPublicKey);
    // 3. Derive the shared AES key:
    //    const sharedKey = await ecdh.deriveSharedKey(myPrivateKey, importedKey);
    // 4. Store sharedKey in state and pass it to useMessages for encrypt/decrypt

    console.log(`[Chat.jsx] Contact selected: ${contact.username} — ECDH key exchange will happen here`);
  };

  // ── Responsive layout: toggle sidebar on mobile ────────────────────────────
  const isMobile = window.innerWidth < 768;

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#020817',
    }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <div style={{
        display: isMobile && !isMobileSidebarOpen ? 'none' : 'flex',
        flexShrink: 0,
      }}>
        <Sidebar
          selectedContact={selectedContact}
          onSelectContact={handleSelectContact}
          currentUsername={currentUser?.username}
          onLogout={onLogout}
        />
      </div>

      {/* ── Chat Window ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile: Back button to show sidebar */}
        {isMobile && selectedContact && (
          <button
            onClick={() => setMobileSidebarOpen(true)}
            style={{
              background: '#1e293b',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '10px 16px',
              textAlign: 'left',
              fontSize: '13px',
            }}
          >
            ← Contacts
          </button>
        )}

        {isLoading ? (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#334155',
          }}>
            Loading messages…
          </div>
        ) : (
          <ChatWindow
            contact={selectedContact}
            messages={messages}
            onSend={handleSendMessage}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
