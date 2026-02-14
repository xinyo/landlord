import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid-1234',
}));
