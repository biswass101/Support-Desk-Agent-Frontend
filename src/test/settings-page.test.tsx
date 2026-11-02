import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsPage from '@/app/settings/page';
import * as settingsHooks from '@/features/settings/hooks/use-settings';

vi.mock('@/features/settings/hooks/use-settings', () => ({
  useSystemInfo: vi.fn(),
  useResetToPending: vi.fn(),
  useReseedDatabase: vi.fn(),
  useClearAllData: vi.fn(),
}));

vi.mock('@/components/layout/dashboard-shell', () => ({
  DashboardShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('SettingsPage Component', () => {
  const mockSystemInfo = {
    status: 'healthy',
    database: 'connected',
    geminiModel: 'gemini-3.5-flash-lite',
    nodeEnv: 'development',
    uptimeSeconds: 3660,
    counts: {
      tickets: 3,
      executions: 7,
      customers: 3,
    },
  };

  const mockResetMutate = vi.fn();
  const mockReseedMutate = vi.fn();
  const mockClearMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(settingsHooks, 'useResetToPending').mockReturnValue({
      mutate: mockResetMutate,
      isPending: false,
    } as unknown as ReturnType<typeof settingsHooks.useResetToPending>);

    vi.spyOn(settingsHooks, 'useReseedDatabase').mockReturnValue({
      mutate: mockReseedMutate,
      isPending: false,
    } as unknown as ReturnType<typeof settingsHooks.useReseedDatabase>);

    vi.spyOn(settingsHooks, 'useClearAllData').mockReturnValue({
      mutate: mockClearMutate,
      isPending: false,
    } as unknown as ReturnType<typeof settingsHooks.useClearAllData>);
  });

  it('renders system metadata and reviewer controls', () => {
    vi.spyOn(settingsHooks, 'useSystemInfo').mockReturnValue({
      data: mockSystemInfo,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof settingsHooks.useSystemInfo>);

    render(<SettingsPage />);

    expect(screen.getByText('System Settings & Evaluation Controls')).toBeInTheDocument();
    expect(screen.getByText('gemini-3.5-flash-lite')).toBeInTheDocument();
    expect(screen.getByText('Database Connected')).toBeInTheDocument();
    expect(screen.getByText('Reset Tickets to Pending (Reviewer Mode)')).toBeInTheDocument();
    expect(screen.getByText('Re-Seed Evaluation Dataset')).toBeInTheDocument();
    expect(screen.getByText('Clear All Database Records')).toBeInTheDocument();
  });

  it('handles clicking reset, reseed, and clear actions', () => {
    vi.spyOn(settingsHooks, 'useSystemInfo').mockReturnValue({
      data: mockSystemInfo,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof settingsHooks.useSystemInfo>);

    render(<SettingsPage />);

    const resetBtn = screen.getByRole('button', { name: /reset to pending state/i });
    fireEvent.click(resetBtn);
    expect(mockResetMutate).toHaveBeenCalledTimes(1);

    const reseedBtn = screen.getByRole('button', { name: /re-seed default tickets/i });
    fireEvent.click(reseedBtn);
    expect(mockReseedMutate).toHaveBeenCalledTimes(1);

    const clearBtn = screen.getByRole('button', { name: /clear all records/i });
    fireEvent.click(clearBtn);
    expect(mockClearMutate).toHaveBeenCalledTimes(1);
  });

  it('renders loading skeletons while fetching system metadata', () => {
    vi.spyOn(settingsHooks, 'useSystemInfo').mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof settingsHooks.useSystemInfo>);

    const { container } = render(<SettingsPage />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });
});
