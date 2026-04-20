/**
 * pages/Register.jsx
 * -------------------
 * Registration page — create a new account.
 *
 * What this file does RIGHT NOW:
 *   - Renders a registration form with username, password, and confirm password fields
 *   - Validates that passwords match client-side
 *   - Calls placeholder logic on submit
 *
 * What you will add LATER:
 *   - Call authService.register(username, password)
 *   - ECDH NOTE: After registration, generate the user's ECDH key pair
 *       and send the PUBLIC key to the server for storage.
 *       The PRIVATE key must stay in memory — never send it anywhere.
 *
 * Props:
 *   - onRegister : Callback called with { user, token } on successful registration
 *   - onGoLogin  : Callback to switch to the Login page
 */

import React, { useState } from 'react';
import { register } from '../services/authService';

const Register = ({ onRegister, onGoLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Username, email, and password are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    const result = await register({ username, email, password });

    // Store token in localStorage
    if (result.token) {
      localStorage.setItem('token', result.token);
    }

    // ECDH NOTE: After creating the account, generate an ECDH key pair:
    // const { publicKey, privateKey } = await ecdh.generateKeyPair();
    // const exportedPublicKey = await ecdh.exportPublicKey(publicKey);
    // Then send exportedPublicKey to the server to store with the user profile.
    // The privateKey stays in memory (stored in AuthContext).

    onRegister({ user: result, token: result.token });
  }
};

return (
  <div style={styles.page}>
    <div style={styles.card}>
      <div style={styles.logo}>🛡️</div>
      <h1 style={styles.title}>Create Account</h1>
      <p style={styles.subtitle}>Join SecureChat — private by design</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="choose_a_username"
            style={styles.input}
            autoComplete="username"
          />
        </div>

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
            placeholder="min. 8 characters"
            style={styles.input}
            autoComplete="new-password"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="repeat your password"
            style={{
              ...styles.input,
              borderColor: confirmPassword && confirmPassword !== password ? '#ef4444' : '#334155',
            }}
            autoComplete="new-password"
          />
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button type="submit" disabled={isLoading} style={styles.button}>
          {isLoading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p style={styles.switchText}>
        Already have an account?{' '}
        <span onClick={onGoLogin} style={styles.link}>Sign in</span>
      </p>

      <div style={styles.securityNote}>
        🔑 On registration, your device will generate an ECDH key pair.<br />
        Your private key <strong style={{ color: '#38bdf8' }}>never leaves your device</strong>.
      </div>
    </div>
  </div>
);


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
  logo: { fontSize: '48px', marginBottom: '12px' },
  title: { color: '#f1f5f9', fontSize: '24px', fontWeight: 700, margin: '0 0 6px' },
  subtitle: { color: '#64748b', fontSize: '14px', margin: '0 0 32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { textAlign: 'left' },
  label: { display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px', fontWeight: 500 },
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
    backgroundColor: '#0e7490',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 600,
    padding: '12px',
    marginTop: '4px',
  },
  switchText: { color: '#64748b', fontSize: '13px', marginTop: '20px' },
  link: { color: '#38bdf8', cursor: 'pointer', fontWeight: 600 },
  securityNote: {
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

export default Register;
