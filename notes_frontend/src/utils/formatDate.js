export function formatDate(ts) {
  try {
    const d = typeof ts === 'number' ? new Date(ts) : new Date(ts || Date.now());
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
}
