import { BookOpen, Code2, History, LogIn, UserPlus } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { APP_VERSION } from '../../config.js';
import { ThemeToggle } from '../../components/shared/ThemeToggle.jsx';
import { UserMenu } from '../../components/shared/UserMenu.jsx';
import { useAuth } from '../auth/AuthProvider.jsx';

const navClass = ({ isActive }) => (isActive ? 'active' : undefined);

export function DocsLayout() {
  const { user } = useAuth();

  return (
    <div className="ui-docs-shell">
      <a className="skip-link" href="#docs-main">
        {'Skip to content'}
      </a>

      <header className="ui-docs-header">
        <div className="ui-docs-header__inner">
          <Link to={user ? '/' : '/docs'} className="ui-brand">
            Notes<span>API</span>
          </Link>

          <nav className="ui-docs-header__nav" aria-label={'Documentation'}>
            <NavLink to="/docs" end className={navClass}>
              <BookOpen size={16} aria-hidden="true" />
              {'Documentation'}
            </NavLink>
            <NavLink to="/changelog" className={navClass}>
              <History size={16} aria-hidden="true" />
              {'Changelog'}
            </NavLink>
            {user?.role === 'admin' ? (
              <NavLink to="/dev/docs" className={navClass}>
                <Code2 size={16} aria-hidden="true" />
                {'Developer docs'}
              </NavLink>
            ) : null}
          </nav>

          <div className="ui-docs-header__actions">
            <ThemeToggle />
            {user ? (
              <>
                <Link to="/" className="ui-button ui-button--secondary ui-button--sm">
                  {'Back to app'}
                </Link>
                <UserMenu />
              </>
            ) : (
              <>
                <Link to="/register" className="ui-header__link">
                  <UserPlus size={16} aria-hidden="true" />
                  {'Register'}
                </Link>
                <Link to="/login" className="ui-button ui-button--primary ui-button--sm">
                  <LogIn size={16} aria-hidden="true" />
                  {'Log in'}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="ui-docs-main" id="docs-main">
        <div className="ui-container">
          <Outlet />
        </div>
      </main>

      <footer className="ui-docs-footer">
        <div className="ui-container ui-docs-footer__inner">
          <span>
            © {new Date().getFullYear()} {'Notes API'}
          </span>
          <span>Version {APP_VERSION}</span>
        </div>
      </footer>
    </div>
  );
}
