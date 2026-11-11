export function formatDate(value, options = {}) {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  }).format(new Date(value));
}

export function formatShortDate(value) {
  return formatDate(value, { dateStyle: 'medium', timeStyle: undefined });
}
