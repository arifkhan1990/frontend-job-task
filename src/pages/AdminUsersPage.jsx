import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../components/Alert.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { apiRequest, formatApiError } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../hooks/useApi.js';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'user',
  interests: '',
};

export function AdminUsersPage() {
  const { user: currentUser, token } = useAuth();
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const {
    data: users,
    meta,
    loading,
    error: loadError,
    reload,
  } = useApi(`/users?page=${page}&limit=10`, { token });

  const userList = users || [];

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError('');
  }

  function startEdit(user) {
    setEditing(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      interests: (user.interests || []).join(', '),
    });
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');

    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
      interests: form.interests
        .split(',')
        .map((interest) => interest.trim())
        .filter(Boolean),
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    try {
      if (editing) {
        await apiRequest(`/users/${editing._id}`, {
          method: 'PATCH',
          token,
          body: payload,
        });
        setEditing(null);
        setForm(emptyForm);
        reload();
      } else {
        await apiRequest('/users', {
          method: 'POST',
          token,
          body: payload,
        });
        setForm(emptyForm);

        if (page !== 1) {
          setPage(1);
        } else {
          reload();
        }
      }
    } catch (requestError) {
      setError(formatApiError(requestError));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(user) {
    if (!window.confirm(`Delete ${user.name} and all of their notes and posts?`)) {
      return;
    }

    setBusy(true);
    setError('');

    try {
      await apiRequest(`/users/${user._id}`, {
        method: 'DELETE',
        token,
      });

      if (userList.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        reload();
      }
    } catch (requestError) {
      setError(formatApiError(requestError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack">
      <div className="page-heading">
        <div>
          <h1>Users</h1>
          <p className="muted">Create accounts, update roles and remove users.</p>
        </div>
      </div>

      <Alert>{error || loadError}</Alert>

      <form className="card stack" onSubmit={handleSubmit}>
        <div className="page-heading">
          <h2>{editing ? `Edit ${editing.name}` : 'Add user'}</h2>
          {editing ? (
            <button type="button" className="button ghost small" onClick={startCreate}>
              Cancel edit
            </button>
          ) : null}
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="user-name">Name</label>
            <input
              id="user-name"
              name="name"
              value={form.name}
              onChange={updateForm}
              minLength={2}
              maxLength={80}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="user-email">Email</label>
            <input
              id="user-email"
              name="email"
              type="email"
              value={form.email}
              onChange={updateForm}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="user-password">
              Password {editing ? '(leave blank to keep)' : ''}
            </label>
            <input
              id="user-password"
              name="password"
              type="password"
              value={form.password}
              onChange={updateForm}
              minLength={8}
              maxLength={72}
              required={!editing}
            />
          </div>

          <div className="field">
            <label htmlFor="user-role">Role</label>
            <select
              id="user-role"
              name="role"
              value={form.role}
              onChange={updateForm}
              disabled={editing?._id === currentUser._id}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="user-interests">Interests</label>
          <input
            id="user-interests"
            name="interests"
            placeholder="chess, reading, running"
            value={form.interests}
            onChange={updateForm}
          />
        </div>

        <div>
          <button type="submit" className="button" disabled={busy}>
            {busy ? 'Saving…' : editing ? 'Save changes' : 'Create user'}
          </button>
        </div>
      </form>

      {loading ? <div className="loading">Loading users…</div> : null}

      {!loading && userList.length === 0 && !loadError ? (
        <div className="empty">No users found.</div>
      ) : null}

      {!loading && userList.length > 0 ? (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Interests</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user._id}>
                  <td>
                    {user.name}
                    {user._id === currentUser._id ? <span className="muted"> (you)</span> : null}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role}`}>{user.role}</span>
                  </td>
                  <td>{(user.interests || []).join(', ') || '—'}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <button
                        type="button"
                        className="button ghost small"
                        onClick={() => startEdit(user)}
                      >
                        Edit
                      </button>
                      <Link className="button ghost small" to={`/users/${user._id}/posts`}>
                        Posts
                      </Link>
                      <button
                        type="button"
                        className="button danger small"
                        onClick={() => handleDelete(user)}
                        disabled={busy || user._id === currentUser._id}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  );
}
