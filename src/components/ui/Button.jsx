import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn.js';

export function buttonClass(variant = 'primary', size = 'md', className) {
  return cn('ui-button', `ui-button--${variant}`, `ui-button--${size}`, className);
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={buttonClass(variant, size, className)}
      {...props}
    />
  );
}

export function LinkButton({ to, variant = 'primary', size = 'md', className, ...props }) {
  return <Link to={to} className={buttonClass(variant, size, className)} {...props} />;
}
