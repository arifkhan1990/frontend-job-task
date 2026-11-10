import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert.jsx';
import { formatApiError } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    interests: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        interests: form.interests
          .split(',')
          .map((interest) => interest.trim())
          .filter(Boolean),
      });
      navigate('/', { replace: true });
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
          <h1>Create account</h1>
          <p className="muted">New accounts are created with the user role.</p>
        </div>

        <Alert>{error}</Alert>

        <form className="stack" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="register-name">Name</label>
            <input
              id="register-name"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={updateField}
              minLength={2}
              maxLength={80}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={updateField}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={updateField}
              minLength={8}
              maxLength={72}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="register-interests">Interests</label>
            <input
              id="register-interests"
              name="interests"
              placeholder="chess, reading, running"
              value={form.interests}
              onChange={updateField}
            />
            <span className="muted small">Comma-separated. Used by the admin interests view.</span>
          </div>

          <button type="submit" className="button" disabled={busy}>
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="muted small">
          Already registered? <Link to="/login">Log in</Link>.
        </p>
      </div>
    </div>
  );
}
