import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '@/components/layout/sidebar';
import * as healthHooks from '@/features/dashboard/hooks/use-health';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/'),
}));

vi.mock('@/features/dashboard/hooks/use-health', () => ({
  useHealth: vi.fn(),
}));

describe('Sidebar Component', () => {
  it('renders branding and primary navigation links', () => {
    vi.spyOn(healthHooks, 'useHealth').mockReturnValue({
      data: { status: 'healthy', service: 'SupportDesk Backend', database: 'connected', uptimeSeconds: 10, timestamp: '' },
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof healthHooks.useHealth>);

    render(<Sidebar />);

    expect(screen.getByText('SupportDesk Agent')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('All Tickets')).toBeInTheDocument();
    expect(screen.getByText('Agent Activity')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('displays offline badge when health check fails', () => {
    vi.spyOn(healthHooks, 'useHealth').mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as unknown as ReturnType<typeof healthHooks.useHealth>);

    render(<Sidebar />);
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });
});