import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../components/Alert.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../hooks/useApi.js';

export function InterestsPage() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [interestInput, setInterestInput] = useState('');
  const [interestFilter, setInterestFilter] = useState('');

  const path = `/users/grouped-by-interests?page=${page}&limit=10${
    interestFilter ? `&interest=${encodeURIComponent(interestFilter)}` : ''
  }`;

  const {
    data: groups,
    meta,
    loading,
    error,
  } = useApi(path, { token });

  const groupList = groups || [];

  function handleSubmit(event) {
    event.preventDefault();
    setInterestFilter(interestInput.trim());
    setPage(1);
  }

  function handleClear() {
    setInterestInput('');
    setInterestFilter('');
    setPage(1);
  }

  return (
    <div className="stack">
      <div className="page-heading">
        <div>
          <h1>Users by interest</h1>
          <p className="muted">
            A single aggregation pipeline groups users by each interest. Filtering uses the
            multikey interests index.
          </p>
        </div>
      </div>

      <Alert>{error}</Alert>

      <form className="card form-grid" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="interest-filter">Interest</label>
          <input
            id="interest-filter"
            value={interestInput}
            onChange={(event) => setInterestInput(event.target.value)}
            placeholder="e.g. chess"
          />
        </div>
        <div className="actions" style={{ alignSelf: 'end' }}>
          <button type="submit" className="button">
            Filter
          </button>
          <button type="button" className="button ghost" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>

      {loading ? <div className="loading">Loading groups…</div> : null}

      {!loading && groupList.length === 0 && !error ? (
        <div className="empty">No interest groups found.</div>
      ) : null}

      <div className="stack">
        {groupList.map((group) => (
          <article className="group-card" key={group.interest}>
            <div className="group-head">
              <h2>{group.interest}</h2>
              <span className="badge">
                {group.userCount} {group.userCount === 1 ? 'user' : 'users'}
              </span>
            </div>
            <ul>
              {group.users.map((user) => (
                <li key={user._id}>
                  <Link to={`/users/${user._id}/posts`}>{user.name}</Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  );
}
