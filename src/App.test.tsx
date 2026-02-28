import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock uuid used elsewhere in the app
vi.mock('uuid', () => ({ v4: () => 'mock-uuid-1234' }));

describe('Language toggle', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('updates localStorage when language button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const buttons = container.querySelectorAll('button');
    const langButton = Array.from(buttons).find((b) => {
      const svg = b.querySelector('svg');
      return !!(svg && svg.getAttribute('class')?.includes('lucide-languages'));
    });

    expect(langButton).toBeDefined();
    await user.click(langButton!);

    expect(localStorage.getItem('language')).toBe('zh');
  });

  it('loads language preference from localStorage on mount', () => {
    localStorage.setItem('language', 'zh');
    render(<App />);
    expect(localStorage.getItem('language')).toBe('zh');
  });
});
