import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider.jsx';

export function AuthLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = location.pathname === '/register';
  const exitTo = user ? '/' : '/docs';

  return (
    <DialogPrimitive.Root
      open
      onOpenChange={(open) => {
        if (!open) {
          navigate(exitTo, { replace: true });
        }
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="ui-dialog-overlay ui-auth-overlay" />
        <DialogPrimitive.Content
          className="ui-dialog-content ui-dialog-content--sm ui-auth-modal"
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            event.currentTarget.querySelector('input')?.focus();
          }}
        >
          <DialogPrimitive.Title className="sr-only">
            {isRegister ? 'Create account' : 'Log in'}
          </DialogPrimitive.Title>

          <div className="ui-auth-modal__top">
            <Link to={exitTo} className="ui-brand">
              Notes<span>API</span>
            </Link>
            <DialogPrimitive.Close asChild>
              <button type="button" className="ui-icon-button" aria-label={'Close'}>
                <X size={18} aria-hidden="true" />
              </button>
            </DialogPrimitive.Close>
          </div>

          <Outlet />

          <div className="ui-auth-modal__links">
            <Link to="/docs">{'Documentation'}</Link>
            <Link to="/changelog">{'Changelog'}</Link>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
