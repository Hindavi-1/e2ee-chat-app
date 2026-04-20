/**
 * App.jsx
 * --------
 * Root component. Controls which page is shown based on auth state.
 * Uses simple local state for routing instead of react-router-dom
 * to keep the skeleton easy to run without extra dependencies.
 *
 * Page flow:
 *   'login'    → Login.jsx
 *   'register' → Register.jsx
 *   'chat'     → Chat.jsx  (only when user is logged in)
 *
 * What you will add LATER:
 *   - Replace the simple page/state router with react-router-dom
 *   - Wrap the app in <AuthProvider> to use context (see context/AuthContext.jsx)
 *   - Add a route guard so unauthenticated users can't reach /chat
 */

import React, { useState } from 'react';
import Login    from './pages/Login';
import Register from './pages/Register';
import Chat     from './pages/Chat';

// Global reset styles (injected once)
const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background-color: #020817;
    color: #f1f5f9;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  input, textarea, button { font-family: inherit; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0f172a; }
  ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
`;

const App = () => {
  // ── Page routing state ────────────────────────────────────────────────────
  // 'login' | 'register' | 'chat'
  const [currentPage, setCurrentPage] = useState('login');

  // ── Auth state ────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogin = ({ user, token }) => {
    // TODO: Store token in AuthContext or memory
    setCurrentUser(user);
    setCurrentPage('chat');
  };

  const handleRegister = ({ user, token }) => {
    // After registration, auto-login the user
    setCurrentUser(user);
    setCurrentPage('chat');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
    localStorage.removeItem('token');
    // TODO: Call socketService.disconnect() here
    // TODO: Clear ECDH private key from memory
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Inject global CSS reset */}
      <style>{globalStyles}</style>

      {currentPage === 'login' && (
        <Login
          onLogin={handleLogin}
          onGoRegister={() => setCurrentPage('register')}
        />
      )}

      {currentPage === 'register' && (
        <Register
          onRegister={handleRegister}
          onGoLogin={() => setCurrentPage('login')}
        />
      )}

      {currentPage === 'chat' && currentUser && (
        <Chat
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

export default App;
