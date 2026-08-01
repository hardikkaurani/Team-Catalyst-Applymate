import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export function formatDate(dateString, formatStr = 'MMM dd, yyyy') {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return isValid(date) ? format(date, formatStr) : 'N/A';
  } catch (error) {
    return 'N/A';
  }
}

export function formatTimeAgo(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return isValid(date) ? `${formatDistanceToNow(date)} ago` : 'N/A';
  } catch (error) {
    return 'N/A';
  }
}

export function formatInputDate(dateString) {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
  } catch (error) {
    return '';
  }
}
