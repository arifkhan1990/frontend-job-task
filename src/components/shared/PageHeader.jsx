export function PageHeader({ title, description, actions, children }) {
  return (
    <div className="ui-page-header">
      <div>
        <h1>{title}</h1>
        {description ? <p className="ui-muted">{description}</p> : null}
        {children}
      </div>
      {actions ? <div className="ui-page-header__actions">{actions}</div> : null}
    </div>
  );
}
