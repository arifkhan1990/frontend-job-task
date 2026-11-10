import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../components/Alert.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../hooks/useApi.js';

export function AdminNotesPage() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [ownerId, setOwnerId] = useState('');

  const { data: users } = useApi('/users?page=1&limit=100', { token });
  const userList = users || [];

  const path = `/notes?page=${page}&limit=10${ownerId ? `&ownerId=${ownerId}` : ''}`;
  const {
    data: notes,
    meta,
    loading,
    error,
  } = useApi(path, { token });

  const noteList = notes || [];

  function handleOwnerChange(event) {
    setOwnerId(event.target.value);
    setPage(1);
  }

  return (
    <div className="stack">
      <div className="page-heading">
        <div>
          <h1>All notes</h1>
          <p className="muted">Read-only view across every user. Filter by owner when needed.</p>
        </div>
      </div>

      <Alert>{error}</Alert>

      <div className="card">
        <div className="field">
          <label htmlFor="owner-filter">Owner</label>
          <select id="owner-filter" value={ownerId} onChange={handleOwnerChange}>
            <option value="">All owners</option>
            {userList.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? <div className="loading">Loading notes…</div> : null}

      {!loading && noteList.length === 0 && !error ? (
        <div className="empty">No notes match this filter.</div>
      ) : null}

      {!loading && noteList.length > 0 ? (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Owner</th>
                <th>Title</th>
                <th>Content</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {noteList.map((note) => (
                <tr key={note._id}>
                  <td>
                    <div>{note.owner?.name || 'Unknown'}</div>
                    <div className="muted small">{note.owner?.email}</div>
                  </td>
                  <td>{note.title}</td>
                  <td>
                    <span className="truncate" title={note.content}>
                      {note.content}
                    </span>
                  </td>
                  <td>{new Date(note.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link className="button ghost small" to={`/users/${note.owner?._id}/posts`}>
                      Posts
                    </Link>
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
