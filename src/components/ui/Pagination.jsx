import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button.jsx';

export function Pagination({ meta, onPageChange }) {

  if (!meta || meta.pages <= 1) {
    return null;
  }

  return (
    <nav className="ui-pagination" aria-label={'Pagination'}>
      <Button
        variant="ghost"
        size="sm"
        disabled={meta.page <= 1}
        onClick={() => onPageChange(meta.page - 1)}
      >
        <ChevronLeft size={16} aria-hidden="true" />
        {'Previous'}
      </Button>
      <span className="ui-muted ui-small">
        Page {meta.page} of {meta.pages} · {meta.total} total
      </span>
      <Button
        variant="ghost"
        size="sm"
        disabled={meta.page >= meta.pages}
        onClick={() => onPageChange(meta.page + 1)}
      >
        {'Next'}
        <ChevronRight size={16} aria-hidden="true" />
      </Button>
    </nav>
  );
}
