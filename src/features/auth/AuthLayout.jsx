import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Link, Outlet, useLocation } from 'react-router-dom';

export function AuthLayout() {
  const location = useLocation();
  const isRegister = location.pathname === '/register';

  return (
    <DialogPrimitive.Root open>
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
            <Link to="/" className="ui-brand">
              Notes<span>API</span>
            </Link>
          </div>

          <Outlet />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
