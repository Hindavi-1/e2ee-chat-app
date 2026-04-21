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
import * as socketService from './services/socketService';
import './index.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = ({ user }) => {
    setCurrentUser(user);
    setCurrentPage('chat');
  };

  const handleRegister = ({ user }) => {
    setCurrentUser(user);
    setCurrentPage('chat');
  };

  const handleLogout = () => {
    socketService.disconnect();
    setCurrentUser(null);
    setCurrentPage('login');
    localStorage.removeItem('token');
    // Note: we intentionally keep the privateKey in localStorage
    // so the user can reconnect from the same device without re-registering.
  };

  return (
    <>
      {currentPage === 'login' && (
        <Login onLogin={handleLogin} onGoRegister={() => setCurrentPage('register')} />
      )}
      {currentPage === 'register' && (
        <Register onRegister={handleRegister} onGoLogin={() => setCurrentPage('login')} />
      )}
      {currentPage === 'chat' && currentUser && (
        <Chat currentUser={currentUser} onLogout={handleLogout} />
      )}
    </>
  );
};

export default App;
