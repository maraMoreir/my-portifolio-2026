import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Not using vitest's `globals: true` (this project imports test helpers
// explicitly everywhere else too), so React Testing Library's automatic
// per-test cleanup doesn't self-register — without this, DOM from one
// test leaks into the next and testid lookups start matching multiple
// elements.
afterEach(() => {
  cleanup();
});
