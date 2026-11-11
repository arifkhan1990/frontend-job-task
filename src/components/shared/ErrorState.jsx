import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export function ErrorState({ message, onRetry }) {

  return (
    <div className="ui-empty ui-empty--error" role="alert">
      <AlertTriangle size={28} aria-hidden="true" className="ui-empty__icon" />
      <h3>{'Could not load this page.'}</h3>
      {message ? <p className="ui-muted">{message}</p> : null}
      {onRetry ? (
        <div className="ui-empty__action">
          <Button variant="secondary" onClick={onRetry}>
            {'Try again'}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
