import * as ToastPrimitive from '@radix-ui/react-toast';
import {
  CheckCircle2,
  Info,
  X,
  XCircle,
} from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const ToastContext = createContext(null);
let nextId = 0;

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((tone, message, options = {}) => {
    const key = options.key || `${tone}:${message}`;

    setToasts((current) => {
      if (current.some((toast) => toast.key === key)) {
        return current;
      }

      nextId += 1;
      return [...current, { id: nextId, key, tone, message }];
    });
  }, []);

  const remove = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useMemo(
    () => ({
      success: (message, options) => push('success', message, options),
      error: (message, options) => push('error', message, options),
      info: (message, options) => push('info', message, options),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={toast}>
      <ToastPrimitive.Provider swipeDirection="right" duration={5000}>
        {children}
        <ToastPrimitive.Viewport
          className="ui-toast-viewport"
          aria-label={'Notifications'}
        >
          {toasts.map((item) => {
            const Icon = ICONS[item.tone];

            return (
              <ToastPrimitive.Root
                key={item.id}
                className={`ui-toast ui-toast--${item.tone}`}
                onOpenChange={(open) => {
                  if (!open) {
                    remove(item.id);
                  }
                }}
              >
                <Icon size={18} aria-hidden="true" className="ui-toast__icon" />
                <ToastPrimitive.Title className="ui-toast__message">
                  {item.message}
                </ToastPrimitive.Title>
                <ToastPrimitive.Close asChild>
                  <button
                    type="button"
                    className="ui-toast__close"
                    aria-label={'Dismiss'}
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </ToastPrimitive.Close>
              </ToastPrimitive.Root>
            );
          })}
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return context;
}
