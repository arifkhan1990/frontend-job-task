import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title || t('Are you sure?')}
      description={description || t('This action cannot be undone.')}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>
            {t('Cancel')}
          </Button>
          <Button variant={tone} onClick={onConfirm} disabled={busy}>
            {busy ? t('Loading…') : confirmLabel || t('Delete')}
          </Button>
        </>
      }
    />
  );
}
