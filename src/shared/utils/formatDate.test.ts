import { describe, it, expect } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats a date-only string without shifting the calendar day', () => {
    // Regression guard: new Date('2024-02-15') parses as UTC midnight,
    // which rolls back to Feb 14 when formatted in a negative-UTC-offset
    // timezone (e.g. America/Sao_Paulo).
    expect(formatDate('2024-02-15')).toBe('15 de fevereiro de 2024');
  });

  it('formats a full ISO datetime string using only its date portion', () => {
    expect(formatDate('2026-08-16T14:58:55.755011Z')).toBe('16 de agosto de 2026');
  });
});
