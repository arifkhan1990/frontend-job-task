import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button.jsx';

export function Pagination({ meta, onPageChange }) {
  const { t } = useTranslation();

  if (!meta || meta.pages <= 1) {
    return null;
  }

  return (
    <nav className="ui-pagination" aria-label="Pagination">
      <Button
        variant="ghost"
        size="sm"
        disabled={meta.page <= 1}
        onClick={() => onPageChange(meta.page - 1)}
      >
        <ChevronLeft size={16} aria-hidden="true" />
        {t('Previous')}
      </Button>
      <span className="ui-muted ui-small">
        {t('Page {{page}} of {{pages}}', { page: meta.page, pages: meta.pages })} ·{' '}
        {t('{{total}} total', { total: meta.total })}
      </span>
      <Button
        variant="ghost"
        size="sm"
        disabled={meta.page >= meta.pages}
        onClick={() => onPageChange(meta.page + 1)}
      >
        {t('Next')}
        <ChevronRight size={16} aria-hidden="true" />
      </Button>
    </nav>
  );
}
