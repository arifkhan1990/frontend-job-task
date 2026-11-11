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

export function formatRelativeDate(value) {
  if (!value) {
    return '';
  }

  const diff = new Date(value).getTime() - Date.now();
  const minutes = Math.round(diff / 60000);

  if (Math.abs(minutes) < 1) {
    return 'Just now';
  }

  const formatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });
  const units = [
    ['year', 525600],
    ['month', 43200],
    ['week', 10080],
    ['day', 1440],
    ['hour', 60],
    ['minute', 1],
  ];

  for (const [unit, size] of units) {
    if (Math.abs(minutes) >= size) {
      return formatter.format(Math.round(minutes / size), unit);
    }
  }

  return 'Just now';
}
