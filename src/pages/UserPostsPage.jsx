import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert } from '../components/Alert.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { apiRequest, formatApiError } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../hooks/useApi.js';

const emptyForm = { title: '', content: '' };

export function UserPostsPage() {
  const { id } = useParams();
  const { user: currentUser, token } = useAuth();
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [id]);

  const {
    data,
    meta,
    loading,
    error: loadError,
    reload,
  } = useApi(`/users/${id}/posts?page=${page}&limit=10`, { token });

  const postUser = data?.user;
  const posts = data?.posts || [];
  const isOwnProfile = currentUser?._id === id;

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleCreate(event) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      await apiRequest('/posts', {
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

  return (
    <div className="stack">
      <div className="page-heading">
        <div>
          <h1>{postUser ? `Posts by ${postUser.name}` : 'Posts'}</h1>
          <p className="muted">Public posts. Anyone can read this page.</p>
        </div>
        {isOwnProfile ? <span className="badge">Your profile</span> : null}
      </div>

      <Alert>{error || loadError}</Alert>

      {isOwnProfile ? (
        <form className="card stack" onSubmit={handleCreate}>
          <h2>New post</h2>
          <div className="field">
            <label htmlFor="post-title">Title</label>
            <input
              id="post-title"
              name="title"
              value={form.title}
              onChange={updateForm}
              maxLength={200}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="post-content">Content</label>
            <textarea
              id="post-content"
              name="content"
              value={form.content}
              onChange={updateForm}
              maxLength={20000}
              required
            />
          </div>
          <div>
            <button type="submit" className="button" disabled={busy}>
              {busy ? 'Publishing…' : 'Publish post'}
            </button>
          </div>
        </form>
      ) : null}

      {!currentUser ? (
        <p className="muted small">
          <Link to="/login">Log in</Link> to write posts on your own profile.
        </p>
      ) : null}

      {loading ? <div className="loading">Loading posts…</div> : null}

      {!loading && posts.length === 0 && !loadError ? (
        <div className="empty">No posts yet.</div>
      ) : null}

      <div className="note-list">
        {posts.map((post) => (
          <article className="note-card" key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <div className="note-meta">
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
          </article>
        ))}
      </div>

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  );
}
