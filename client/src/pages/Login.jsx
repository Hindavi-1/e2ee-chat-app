/**
 * pages/Login.jsx
 * ----------------
 * Login page — username and password form.
 *
 * What this file does RIGHT NOW:
 *   - Renders the login form with controlled inputs
 *   - On submit, calls a placeholder that logs and calls onLogin()
 *
 * What you will add LATER:
 *   - Call authService.login(username, password)
 *   - On success: store token via loginUser() from AuthContext
 *   - On failure: display specific error messages (wrong password, user not found)
 *   - ECDH NOTE: After login, restore or regenerate the user's ECDH key pair
 *
 * Props:
 *   - onLogin     : Callback called with { user, token } on successful login
 *   - onGoRegister: Callback to switch to the Register page
 */

import React, { useState } from 'react';
import { login } from '../services/authService';

const Login = ({ onLogin, onGoRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({ email, password });
      
      // Store token in localStorage
      if (result.token) {
        localStorage.setItem('token', result.token);
      }

      onLogin({ user: result, token: result.token });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>🔐</div>
        <h1 style={styles.title}>SecureChat</h1>
        <p style={styles.subtitle}>End-to-end encrypted messaging</p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your_email@example.com"
              style={styles.input}
              autoComplete="email"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              autoComplete="current-password"
            />
          </div>

          {/* Error message */}
          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Switch to Register */}
        <p style={styles.switchText}>
          No account?{' '}
          <span onClick={onGoRegister} style={styles.link}>
            Create one
          </span>
        </p>

        {/* Note about future encryption */}
        <div style={styles.encryptionNote}>
          🔒 Your messages will be encrypted client-side using AES-GCM.<br />
          Keys are exchanged via ECDH — the server never sees plaintext.
        </div>
      </div>
    </div>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#020817',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  logo:     { fontSize: '48px', marginBottom: '12px' },
  title:    { color: '#f1f5f9', fontSize: '24px', fontWeight: 700, margin: '0 0 6px' },
  subtitle: { color: '#64748b', fontSize: '14px', margin: '0 0 32px' },
  form:     { display: 'flex', flexDirection: 'column', gap: '16px' },
  field:    { textAlign: 'left' },
  label:    { display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px', fontWeight: 500 },
  input: {
    width: '100%',
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#f1f5f9',
    fontSize: '14px',
    padding: '10px 12px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  error: {
    backgroundColor: '#450a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '8px',
    color: '#fca5a5',
    fontSize: '13px',
    padding: '10px',
  },
  button: {
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 600,
    padding: '12px',
    marginTop: '4px',
  },
  switchText:    { color: '#64748b', fontSize: '13px', marginTop: '20px' },
  link:          { color: '#38bdf8', cursor: 'pointer', fontWeight: 600 },
  encryptionNote: {
    backgroundColor: '#0c1a2e',
    border: '1px solid #1e3a5f',
    borderRadius: '8px',
    color: '#475569',
    fontSize: '11px',
    lineHeight: '1.6',
    marginTop: '24px',
    padding: '12px',
  },
};

export default Login;
