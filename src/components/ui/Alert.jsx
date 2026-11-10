import { cn } from '../../utils/cn.js';

export function Alert({ tone = 'error', children }) {
  if (!children) {
    return null;
  }

  return (
    <div
      className={cn('ui-alert', `ui-alert--${tone}`)}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
}
