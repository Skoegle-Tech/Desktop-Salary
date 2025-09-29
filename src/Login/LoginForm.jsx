import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {apiUrl} from '../Config';
const styles = {
  appContainer: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    height: '100vh', background: '#f6f7fb',
  },
  loginBox: {
    padding: '30px 40px', borderRadius: '8px', background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', minWidth: '340px',
  },
  title: { marginBottom: '24px', textAlign: 'center', fontWeight: 700 },
  fieldContainer: { marginBottom: '18px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: 500 },
  input: {
    width: '100%', padding: '9px 12px', fontSize: '16px', borderRadius: '4px',
    border: '1px solid #ccc', outline: 'none', transition: 'border 0.2s',
  },
  inputFocus: { border: '1.5px solid #0070f3' },
  error: { color: 'red', marginBottom: '14px', textAlign: 'center' },
  button: {
    width: '100%', padding: '10px', fontSize: '16px', background: '#0070f3',
    color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s',
  },
  buttonHover: { background: '#005bb5' },
};

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focusInput, setFocusInput] = useState({ email: false, pass: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.user) {
        localStorage.setItem('user', JSON.stringify({
          name: data.user.name,
          email: data.user.email,
        }));
        sessionStorage.setItem('isAuthenticated', 'true');
        onLogin();
        navigate('/'); // Redirect to home after login
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div style={styles.appContainer}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div style={styles.fieldContainer}>
            <label htmlFor="email" style={styles.label}>Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                ...styles.input,
                ...(focusInput.email ? styles.inputFocus : {})
              }}
              required
              autoFocus
              onFocus={() => setFocusInput(f => ({ ...f, email: true }))}
              onBlur={() => setFocusInput(f => ({ ...f, email: false }))}
            />
          </div>
          <div style={styles.fieldContainer}>
            <label htmlFor="password" style={styles.label}>Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                ...styles.input,
                ...(focusInput.pass ? styles.inputFocus : {})
              }}
              required
              onFocus={() => setFocusInput(f => ({ ...f, pass: true }))}
              onBlur={() => setFocusInput(f => ({ ...f, pass: false }))}
            />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button
            type="submit"
            style={styles.button}
            disabled={loading}
            onMouseOver={e => e.currentTarget.style.background = styles.buttonHover.background}
            onMouseOut={e => e.currentTarget.style.background = styles.button.background}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;