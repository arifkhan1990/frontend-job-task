import { useState } from 'react';
import { Alert } from '../components/Alert.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { apiRequest, formatApiError } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../hooks/useApi.js';

const emptyForm = { title: '', content: '' };

export function NotesPage() {
  const { user, token } = useAuth();
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const path =
    user?.role === 'admin'
      ? `/notes?page=${page}&limit=10&ownerId=${user._id}`
      : `/notes?page=${page}&limit=10`;

  const {
    data: notes,
    meta,
    loading,
    error: loadError,
    reload,
  } = useApi(path, { token });

  if (!user) {
    return null;
  }

  const noteList = notes || [];

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateEditForm(event) {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  }

  async function handleCreate(event) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      await apiRequest('/notes', {
        method: 'POST',
        token,
        body: form,
      });
      setForm(emptyForm);

      if (page !== 1) {
        setPage(1);
      } else {
        reload();
      }
    } catch (requestError) {
      setError(formatApiError(requestError));
    } finally {
      setBusy(false);
    }
  }

  function startEdit(note) {
    setEditingId(note._id);
    setEditForm({ title: note.title, content: note.content });
    setError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(emptyForm);
  }

  async function handleUpdate(event) {
    event.preventDefault();
    if (!editingId) {
      return;
    }

    setBusy(true);
    setError('');

    try {
      await apiRequest(`/notes/${editingId}`, {
        method: 'PATCH',
        token,
        body: editForm,
      });
      cancelEdit();
      reload();
    } catch (requestError) {
      setError(formatApiError(requestError));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(note) {
    if (!window.confirm(`Delete "${note.title}"?`)) {
      return;
    }

    setBusy(true);
    setError('');

    try {
      await apiRequest(`/notes/${note._id}`, {
        method: 'DELETE',
        token,
      });

      if (noteList.length === 1 && page > 1) {
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
          <h1>My notes</h1>
          <p className="muted">
            {user.role === 'admin'
              ? 'These are your own notes. Use All notes to read everyone else’s.'
              : 'Create, edit and delete your private notes.'}
          </p>
        </div>
      </div>

      <Alert>{error || loadError}</Alert>

      <form className="card stack" onSubmit={handleCreate}>
        <h2>New note</h2>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="note-title">Title</label>
            <input
              id="note-title"
              name="title"
              value={form.title}
              onChange={updateForm}
              maxLength={200}
              required
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="note-content">Content</label>
          <textarea
            id="note-content"
            name="content"
            value={form.content}
            onChange={updateForm}
            maxLength={20000}
            required
          />
        </div>
        <div>
          <button type="submit" className="button" disabled={busy}>
            {busy ? 'Saving…' : 'Create note'}
          </button>
        </div>
      </form>

      {loading ? <div className="loading">Loading notes…</div> : null}

      {!loading && noteList.length === 0 && !loadError ? (
        <div className="empty">No notes yet. Create your first one above.</div>
      ) : null}

      <div className="note-list">
        {noteList.map((note) => (
          <article className="note-card" key={note._id}>
            {editingId === note._id ? (
              <form className="stack" onSubmit={handleUpdate}>
                <div className="field">
                  <label htmlFor={`edit-title-${note._id}`}>Title</label>
                  <input
                    id={`edit-title-${note._id}`}
                    name="title"
                    value={editForm.title}
                    onChange={updateEditForm}
                    maxLength={200}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor={`edit-content-${note._id}`}>Content</label>
                  <textarea
                    id={`edit-content-${note._id}`}
                    name="content"
                    value={editForm.content}
                    onChange={updateEditForm}
                    maxLength={20000}
                    required
                  />
                </div>
                <div className="actions">
                  <button type="submit" className="button small" disabled={busy}>
                    Save
                  </button>
                  <button type="button" className="button ghost small" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2>{note.title}</h2>
                <p>{note.content}</p>
                <div className="note-meta">
                  <span>{new Date(note.createdAt).toLocaleString()}</span>
                  <div className="actions">
                    <button
                      type="button"
                      className="button ghost small"
                      onClick={() => startEdit(note)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button danger small"
                      onClick={() => handleDelete(note)}
                      disabled={busy}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </article>
        ))}
      </div>

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  );
}
