import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useUiStore } from '@/stores/ui-store';
import * as healthHooks from '@/features/dashboard/hooks/use-health';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/'),
}));

vi.mock('@/features/dashboard/hooks/use-health', () => ({
  useHealth: vi.fn(),
}));

describe('MobileNav Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUiStore.setState({ sidebarOpen: true });
    vi.spyOn(healthHooks, 'useHealth').mockReturnValue({
      data: {
        status: 'healthy',
        service: 'SupportDesk Backend',
        database: 'connected',
        uptimeSeconds: 10,
        timestamp: '',
      },
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof healthHooks.useHealth>);
  });

  it('renders all navigation links including Settings when open', () => {
    render(<MobileNav />);

    expect(screen.getByText('SupportDesk Agent')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('All Tickets')).toBeInTheDocument();
    expect(screen.getByText('Agent Activity')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('does not render when sidebarOpen is false', () => {
    useUiStore.setState({ sidebarOpen: false });
    const { container } = render(<MobileNav />);
    expect(container).toBeEmptyDOMElement();
  });

  it('closes mobile nav when clicking the close button', () => {
    render(<MobileNav />);
    const closeBtn = screen.getByRole('button', { name: /close navigation menu/i });
    fireEvent.click(closeBtn);
    expect(useUiStore.getState().sidebarOpen).toBe(false);
  });
});

