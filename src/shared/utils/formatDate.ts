/**
 * Formats an ISO date string as a long pt-BR date (e.g. "15 de fevereiro de 2024").
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
