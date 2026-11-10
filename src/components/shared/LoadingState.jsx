import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LoadingState({ label }) {
  const { t } = useTranslation();

  return (
    <div className="ui-loading" role="status" aria-live="polite">
      <Loader2 size={22} className="ui-loading__spinner" aria-hidden="true" />
      <span>{label || t('Loading…')}</span>
    </div>
  );
}
