import { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

export function Field({ label, htmlFor, error, hint, counter, children, className }) {
  return (
    <div className={cn('ui-field', className)}>
      {label ? <label htmlFor={htmlFor}>{label}</label> : null}
      {children}
      {(hint && !error) || counter ? (
        <div className="ui-field__meta">
          {hint && !error ? <span className="ui-field__hint">{hint}</span> : null}
          {counter ? <span className="ui-field__counter">{counter}</span> : null}
        </div>
      ) : null}
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
