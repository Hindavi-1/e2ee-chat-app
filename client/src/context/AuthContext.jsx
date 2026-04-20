/**
 * context/AuthContext.jsx
 * ------------------------
 * React context for sharing authentication state across the entire app.
 * Any component can read `currentUser` and call `loginUser`/`logoutUser`
 * without prop drilling.
 *
 * What this file does RIGHT NOW:
 *   - Provides a mock logged-in user so the UI is visible without real auth
 *
 * What you will add LATER:
 *   - Call real authService.login() and authService.register()
 *   - Store the JWT token in memory (NOT localStorage — XSS risk)
 *   - Persist user session using httpOnly cookies or in-memory token refresh
 *   - Store the user's ECDH key pair here (private key stays in memory only)
 */

import React, { createContext, useContext, useState } from 'react';

// Create the context object
const AuthContext = createContext(null);

/**
 * AuthProvider
 * Wraps the app to make auth state available everywhere.
 * Used in App.jsx: <AuthProvider><App /></AuthProvider>
 */
export const AuthProvider = ({ children }) => {
  // ── State ────────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState({
    id: 'mock-user-id',
    username: 'You',
  }); // TODO: Start as null, populate after real login

  const [authToken, setAuthToken] = useState(null);
  // TODO: Store the JWT token here after login (in memory, not localStorage)

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * loginUser()
   * Called after successful login. Stores user and token in context.
   */
  const loginUser = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    // TODO: Also initialize ECDH key pair here and store in context
  };

  /**
   * logoutUser()
   * Clears all auth state.
   */
  const logoutUser = () => {
    setCurrentUser(null);
    setAuthToken(null);
    // TODO: Clear ECDH keys from memory
    // TODO: Disconnect socket via socketService.disconnect()
  };

  // ── Context Value ─────────────────────────────────────────────────────────
  const value = {
    currentUser,
    authToken,
    loginUser,
    logoutUser,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth()
 * Custom hook for consuming auth context in any component.
 *
 * Usage:
 *   const { currentUser, logoutUser } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return context;
};
