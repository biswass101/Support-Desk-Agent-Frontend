import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/providers/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';

function TestConsumer() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('system')}>Set System</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe('Theme Management System', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.classList.remove('dark');
  });

  it('initializes with default system theme and responds to theme changes', async () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('system');
    expect(screen.getByTestId('resolved').textContent).toBe('light');

    await act(async () => {
      fireEvent.click(screen.getByText('Set Dark'));
    });

    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    await act(async () => {
      fireEvent.click(screen.getByText('Set Light'));
    });

    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(screen.getByTestId('resolved').textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('toggles theme between light and dark', async () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Toggle'));
    });

    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    await act(async () => {
      fireEvent.click(screen.getByText('Toggle'));
    });

    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('renders ThemeToggle icon button and toggles theme on click', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(toggleBtn);
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('renders ThemeToggle segmented variant and allows selection', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle variant="segmented" />
      </ThemeProvider>
    );

    const darkOption = screen.getByRole('button', { name: /dark/i });
    const lightOption = screen.getByRole('button', { name: /light/i });
    const systemOption = screen.getByRole('button', { name: /system/i });

    expect(darkOption).toBeInTheDocument();
    expect(lightOption).toBeInTheDocument();
    expect(systemOption).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(darkOption);
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    await act(async () => {
      fireEvent.click(lightOption);
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

