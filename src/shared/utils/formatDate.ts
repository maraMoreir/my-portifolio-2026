/**
 * Formats an ISO date (or ISO datetime) string as a long pt-BR date
 * (e.g. "15 de fevereiro de 2024").
 *
 * Parses the calendar date manually (as local, not UTC) instead of just
 * `new Date(dateString)`: for a date-only string like "2024-02-15",
 * `new Date()` parses it as UTC midnight, and formatting that in a
 * negative-UTC-offset timezone (e.g. America/Sao_Paulo, the primary
 * audience here) rolls it back to the previous day — "15 de fevereiro"
 * would render as "14 de fevereiro". Taking only the date portion also
 * means a full ISO timestamp (e.g. from the API's `publishedAt`) shows the
 * same calendar day to every visitor regardless of their timezone.
 */
export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
