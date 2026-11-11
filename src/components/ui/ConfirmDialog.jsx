import { Dialog } from './Dialog.jsx';
import { Button } from './Button.jsx';

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel,
  busy = false,
  tone = 'danger',
}) {

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title || 'Are you sure?'}
      description={description || 'This action cannot be undone.'}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>
            {'Cancel'}
          </Button>
          <Button variant={tone} onClick={onConfirm} disabled={busy}>
            {busy ? 'Loading…' : confirmLabel || 'Delete'}
          </Button>
        </>
      }
    />
  );
}
