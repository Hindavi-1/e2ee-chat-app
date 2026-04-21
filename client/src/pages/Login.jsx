import React, { useState } from 'react';
import { login } from '../services/authService';
import * as ecdh from '../crypto/ecdh';

const Login = ({ onLogin, onGoRegister }) => {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
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
      let exportedPublicKey  = null;
      let exportedPrivateKey = localStorage.getItem(`privateKey_${email}`);

      if (!exportedPrivateKey) {
        const { publicKey, privateKey } = await ecdh.generateKeyPair();
        exportedPublicKey  = await ecdh.exportPublicKey(publicKey);
        exportedPrivateKey = await ecdh.exportPrivateKey(privateKey);
      }

      const loginPayload = { email, password };
      if (exportedPublicKey) loginPayload.publicKey = exportedPublicKey;

      const result = await login(loginPayload);

      if (result.token) localStorage.setItem('token', result.token);
      localStorage.setItem(`privateKey_${email}`, exportedPrivateKey);

      onLogin({ user: result, token: result.token });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ambient-bg">
      <div className="ambient-content">
        <div className="glass-card auth-card">
          <div className="auth-logo">🔐</div>
          <h1 className="auth-title">SecureChat</h1>
          <p className="auth-subtitle">End-to-end encrypted messaging</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="sc-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your_email@example.com"
                className="sc-input"
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label className="sc-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="sc-input"
                autoComplete="current-password"
              />
            </div>

            {error && <div className="auth-error">⚠ {error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="sc-btn-primary"
              style={{ marginTop: '4px' }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <p className="auth-switch">
            No account?{' '}
            <span onClick={onGoRegister} className="auth-link">Create one</span>
          </p>

          <div className="auth-security-note">
            <span>🔒</span>
            <span>
              Messages are encrypted client-side using <strong>AES-GCM</strong>.<br />
              Keys are exchanged via <strong>ECDH</strong> — the server never sees plaintext.
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;
