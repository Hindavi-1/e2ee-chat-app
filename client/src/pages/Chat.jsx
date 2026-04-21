import React, { useState, useEffect } from 'react';
import Sidebar    from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import useMessages from '../hooks/useMessages';
import * as socketService from '../services/socketService';
import * as ecdh          from '../crypto/ecdh';
import { getContacts }    from '../services/chatService';
import { apiRequest }     from '../services/api';

// Reactive window-width hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return isMobile;
};

const Chat = ({ currentUser, onLogout }) => {
  const [contacts,           setContacts]           = useState([]);
  const [selectedContact,    setSelectedContact]    = useState(null);
  const [sharedKey,          setSharedKey]          = useState(null);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [keyExchangeStatus,  setKeyExchangeStatus]  = useState('idle'); // 'idle' | 'loading' | 'ready' | 'error'

  const isMobile = useIsMobile();

  const { messages, handleSendMessage, handleTypingInput, isLoading, isTyping } =
    useMessages(sharedKey, selectedContact, currentUser);

  // ── Connect socket on mount ───────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    socketService.connect(token);
    return () => socketService.disconnect();
  }, []);

  // ── Fetch contact list ────────────────────────────────────────────────────
  useEffect(() => {
    getContacts()
      .then(setContacts)
      .catch((e) => console.error('[Chat] Failed to load contacts:', e));
  }, []);

  // ── Handle contact selection + ECDH key exchange ─────────────────────────
  const handleSelectContact = async (contact) => {
    setSelectedContact(contact);
    setSharedKey(null);
    setKeyExchangeStatus('loading');
    setMobileSidebarOpen(false);

    try {
      const privateKeyStr = localStorage.getItem(`privateKey_${currentUser.email}`);
      if (!privateKeyStr) throw new Error('No private key found — please re-login.');

      const myPrivateKey = await ecdh.importPrivateKey(privateKeyStr);

      // Fetch their public key from the server
      const { publicKey: theirPublicKeyStr } = await apiRequest(`/users/${contact._id}/publicKey`);
      if (!theirPublicKeyStr) throw new Error('Contact has no public key yet.');

      const theirPublicKey = await ecdh.importPublicKey(theirPublicKeyStr);
      const newSharedKey   = await ecdh.deriveSharedKey(myPrivateKey, theirPublicKey);

      setSharedKey(newSharedKey);
      setKeyExchangeStatus('ready');
    } catch (err) {
      console.error('[Chat] Key exchange failed:', err.message);
      setKeyExchangeStatus('error');
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const showSidebar = !isMobile || isMobileSidebarOpen;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-base)', position: 'relative' }}>

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      {showSidebar && (
        <>
          {isMobile && (
            <div
              onClick={() => setMobileSidebarOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 99, backdropFilter: 'blur(2px)' }}
            />
          )}
          <Sidebar
            contacts={contacts}
            selectedContact={selectedContact}
            onSelectContact={(c) => { handleSelectContact(c); setMobileSidebarOpen(false); }}
            currentUser={currentUser}
            onLogout={onLogout}
          />
        </>
      )}

      {/* ── Chat Window ───────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              style={{ background: 'none', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer', padding: '5px 10px', fontSize: '16px', lineHeight: 1, fontFamily: 'inherit' }}
            >
              ☰
            </button>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
              {selectedContact ? selectedContact.username : 'SecureChat'}
            </span>
          </div>
        )}

        {isLoading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 36 }}>🔐</div>
            <div>Loading messages…</div>
          </div>
        ) : (
          <ChatWindow
            contact={selectedContact}
            messages={messages}
            onSend={handleSendMessage}
            onTyping={handleTypingInput}
            currentUser={currentUser}
            keyExchangeStatus={keyExchangeStatus}
            isTyping={isTyping}
            onLogout={onLogout}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
