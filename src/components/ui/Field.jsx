import { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

export function Field({ label, htmlFor, error, hint, children, className }) {
  return (
    <div className={cn('ui-field', className)}>
      {label ? <label htmlFor={htmlFor}>{label}</label> : null}
      {children}
      {hint && !error ? <span className="ui-field__hint">{hint}</span> : null}
      {error ? (
        <span className="ui-field__error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn('ui-input', className)} {...props} />;
});

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn('ui-input ui-textarea', className)} {...props} />;
});
