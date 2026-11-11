import { Loader2 } from 'lucide-react';

export function LoadingState({ label }) {

  return (
    <div className="ui-loading" role="status" aria-live="polite">
      <Loader2 size={22} className="ui-loading__spinner" aria-hidden="true" />
      <span>{label || 'Loading…'}</span>
    </div>
  );
}
