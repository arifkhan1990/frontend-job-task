import { Inbox } from 'lucide-react';

export function EmptyState({ title, description, action, icon: Icon = Inbox }) {
  return (
    <div className="ui-empty">
      <Icon size={28} aria-hidden="true" className="ui-empty__icon" />
      <h3>{title}</h3>
      {description ? <p className="ui-muted">{description}</p> : null}
      {action ? <div className="ui-empty__action">{action}</div> : null}
    </div>
  );
}
