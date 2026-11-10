export function Alert({ children, tone = 'error' }) {
  if (!children) {
    return null;
  }

  return (
    <div className={`alert ${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}
