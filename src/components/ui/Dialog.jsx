import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}) {

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="ui-dialog-overlay" />
        <DialogPrimitive.Content
          className={cn('ui-dialog-content', `ui-dialog-content--${size}`, className)}
        >
          <div className="ui-dialog-header">
            <div>
              <DialogPrimitive.Title className="ui-dialog-title">
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="ui-dialog-description">
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </div>
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                className="ui-icon-button"
                aria-label={'Close'}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </DialogPrimitive.Close>
          </div>

          <div className="ui-dialog-body">{children}</div>

          {footer ? <div className="ui-dialog-footer">{footer}</div> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
