import * as DialogPrimitive from '@radix-ui/react-dialog';
import { LogIn, Menu, UserPlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { APP_VERSION } from '../../config.js';
import { useAuth } from '../../features/auth/AuthProvider.jsx';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { cn } from '../../utils/cn.js';
import { Breadcrumbs } from '../ui/Breadcrumbs.jsx';
import { Sidebar } from './Sidebar.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';
import { UserMenu } from './UserMenu.jsx';

const PATH_LABELS = {
  '/admin/users': 'Users',
  '/admin/notes': 'All notes',
  '/admin/interests': 'Users by interest',
};

function useBreadcrumbs(user) {
  const { pathname } = useLocation();

  if (pathname === '/') {
    return [{ label: 'My notes' }];
  }

  const items = [];

  if (user) {
    items.push({ label: 'Dashboard', to: '/' });
  }

  if (pathname.startsWith('/users/') && pathname.endsWith('/posts')) {
    items.push({ label: 'Posts' });
  } else {
    items.push({ label: PATH_LABELS[pathname] || 'Page not found' });
  }

  return items;
}

export function AppShell() {
  const { user } = useAuth();
  const isDesktop = useMediaQuery('(min-width: 900px)');
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('notes_api_sidebar') === 'collapsed',
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const breadcrumbs = useBreadcrumbs(user);

  useEffect(() => {
    localStorage.setItem('notes_api_sidebar', collapsed ? 'collapsed' : 'expanded');
  }, [collapsed]);

  const brandTarget = user ? '/' : '/login';

  return (
    <div className="ui-shell">
      <a className="skip-link" href="#main">
        {'Skip to content'}
      </a>

      <header className="ui-header">
        <div className="ui-header__inner">
          <div className="ui-header__start">
            {user && !isDesktop ? (
              <button
                type="button"
                className="ui-icon-button"
                onClick={() => setMobileOpen(true)}
                aria-label={'Open menu'}
              >
                <Menu size={20} aria-hidden="true" />
              </button>
            ) : null}

            <Link to={brandTarget} className="ui-brand">
              Notes<span>API</span>
            </Link>
          </div>

          <div className="ui-header__actions">
            {!user ? (
              <>
                <Link to="/login" className="ui-header__link">
                  <LogIn size={16} aria-hidden="true" />
                  {'Log in'}
                </Link>
                <Link to="/register" className="ui-button ui-button--primary ui-button--sm">
                  <UserPlus size={16} aria-hidden="true" />
                  {'Register'}
                </Link>
              </>
            ) : null}

            <ThemeToggle />
            {user ? <UserMenu /> : null}
          </div>
        </div>
      </header>

      <div
        className={cn(
          'ui-shell__body',
          user && isDesktop && 'ui-shell__body--sidebar',
          user && isDesktop && collapsed && 'ui-shell__body--collapsed',
        )}
      >
        {user && isDesktop ? (
          <Sidebar
            user={user}
            collapsed={collapsed}
            onToggle={() => setCollapsed((current) => !current)}
          />
        ) : null}

        <main className="ui-main" id="main">
          <div className="ui-container">
            {breadcrumbs.length > 0 ? <Breadcrumbs items={breadcrumbs} /> : null}
            <Outlet />
          </div>
        </main>
      </div>

      <footer className="ui-footer">
        <div className="ui-container ui-footer__inner">
          <span>
            © {new Date().getFullYear()} {'Notes API'}
          </span>
          <span>Version {APP_VERSION}</span>
        </div>
      </footer>

      {user && !isDesktop ? (
        <DialogPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="ui-dialog-overlay" />
            <DialogPrimitive.Content
              className="ui-sidebar-drawer"
              aria-describedby={undefined}
            >
              <DialogPrimitive.Title className="sr-only">
                {'Primary navigation'}
              </DialogPrimitive.Title>
              <DialogPrimitive.Close asChild>
                <button
                  type="button"
                  className="ui-icon-button ui-sidebar-drawer__close"
                  aria-label={'Close menu'}
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </DialogPrimitive.Close>
              <Sidebar
                user={user}
                onNavigate={() => setMobileOpen(false)}
                showToggle={false}
              />
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      ) : null}
    </div>
  );
}
