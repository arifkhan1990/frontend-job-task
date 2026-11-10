import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert.jsx';
import { formatApiError } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const from = location.state?.from
    ? `${location.state.from.pathname}${location.state.from.search || ''}`
    : '/';

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (requestError) {
      setError(formatApiError(requestError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="card stack">
        <div>
          <h1>Log in</h1>
          <p className="muted">Access your notes and posts.</p>
        </div>

        <Alert>{error}</Alert>

        <form className="stack" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="button" disabled={busy}>
            {busy ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="muted small">
          No account? <Link to="/register">Register here</Link>.
        </p>
      </div>
    </div>
  );
}
