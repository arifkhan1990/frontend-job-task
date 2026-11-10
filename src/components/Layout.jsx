import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navClass = ({ isActive }) => (isActive ? 'active' : undefined);

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            Notes<span>API</span>
          </Link>

          <nav className="nav">
            {user && (
              <NavLink to="/" end className={navClass}>
                My notes
              </NavLink>
            )}
            {user && (
              <NavLink to={`/users/${user._id}/posts`} className={navClass}>
                My posts
              </NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin/users" className={navClass}>
                Users
              </NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin/notes" className={navClass}>
                All notes
              </NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin/interests" className={navClass}>
                Interests
              </NavLink>
            )}
          </nav>

          <div className="account">
            {user ? (
              <>
                <span className="muted small">
                  {user.name} · {user.role}
                </span>
                <button type="button" className="button ghost small" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass}>
                  Log in
                </NavLink>
                <NavLink to="/register" className="button small">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container page">
        <Outlet />
      </main>

      <footer className="container footer">Secure notes API · JWT + MongoDB</footer>
    </div>
  );
}
