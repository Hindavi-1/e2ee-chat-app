import React, { useState } from 'react';
import { register } from '../services/authService';
import * as ecdh from '../crypto/ecdh';

const Register = ({ onRegister, onGoLogin }) => {
  const [username,        setUsername]        = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error,           setError]           = useState('');
  const [isLoading,       setIsLoading]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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

    try {
      const { publicKey, privateKey } = await ecdh.generateKeyPair();
      const exportedPublicKey  = await ecdh.exportPublicKey(publicKey);
      const exportedPrivateKey = await ecdh.exportPrivateKey(privateKey);

      const result = await register({ username, email, password, publicKey: exportedPublicKey });

      if (result.token) localStorage.setItem('token', result.token);
      localStorage.setItem(`privateKey_${email}`, exportedPrivateKey);

      onRegister({ user: result, token: result.token });
    } catch (err) {
      setError(err.message || 'Registration failed. Username or email may already be taken.');
    } finally {
      setIsLoading(false);
    }
  };

  const pwMatch = confirmPassword && confirmPassword === password;
  const pwMismatch = confirmPassword && confirmPassword !== password;

  return (
    <div className="ambient-bg">
      <div className="ambient-content">
        <div className="glass-card auth-card" style={{ maxWidth: 440 }}>
          <div className="auth-logo">🛡️</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join SecureChat — private by design</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="sc-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="choose_a_username"
                className="sc-input"
                autoComplete="username"
              />
            </div>

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
                placeholder="min. 8 characters"
                className="sc-input"
                autoComplete="new-password"
              />
            </div>

            <div className="auth-field">
              <label className="sc-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Confirm Password</span>
                {pwMatch    && <span style={{ color: 'var(--green)',  fontSize: '11px', fontWeight: 600, textTransform: 'none' }}>✓ Passwords match</span>}
                {pwMismatch && <span style={{ color: 'var(--danger)', fontSize: '11px', fontWeight: 600, textTransform: 'none' }}>✗ Mismatch</span>}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="repeat your password"
                className={`sc-input${pwMismatch ? ' error' : ''}`}
                autoComplete="new-password"
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
                  Generating keys & registering…
                </span>
              ) : 'Create Account →'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <span onClick={onGoLogin} className="auth-link">Sign in</span>
          </p>

          <div className="auth-security-note">
            <span>🔑</span>
            <span>
              On registration, your device generates an <strong>ECDH key pair</strong>.<br />
              Your private key <strong>never leaves your device</strong>.
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

export default Register;
