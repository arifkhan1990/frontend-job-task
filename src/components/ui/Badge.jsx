import { cn } from '../../utils/cn.js';

export function Badge({ children, tone = 'neutral', className }) {
  return <span className={cn('ui-badge', `ui-badge--${tone}`, className)}>{children}</span>;
}
