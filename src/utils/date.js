export function formatDate(value, language = 'en', options = {}) {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat(language, {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  }).format(new Date(value));
}

export function formatShortDate(value, language = 'en') {
  return formatDate(value, language, { dateStyle: 'medium', timeStyle: undefined });
}
