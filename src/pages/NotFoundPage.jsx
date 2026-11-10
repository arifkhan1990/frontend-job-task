import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="empty">
      <h1>Page not found</h1>
      <p className="muted">The page you requested does not exist.</p>
      <Link className="button" to="/">
        Back to notes
      </Link>
    </div>
  );
}
