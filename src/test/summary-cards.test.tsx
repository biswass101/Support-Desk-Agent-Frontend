import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummaryCards } from '@/features/dashboard/components/summary-cards';
import * as ticketHooks from '@/features/tickets/hooks/use-tickets';
import { Ticket } from '@/types';

vi.mock('@/features/tickets/hooks/use-tickets', () => ({
  useTickets: vi.fn(),
}));

describe('SummaryCards Component', () => {
  it('renders loading skeleton state', () => {
    vi.spyOn(ticketHooks, 'useTickets').mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as unknown as ReturnType<typeof ticketHooks.useTickets>);

    const { container } = render(<SummaryCards />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders live statistics calculated from actual backend ticket data', () => {
    const mockTickets: Ticket[] = [
      {
        id: 't-1',
        ticketNumber: 'TCK-001',
        customerId: 'c-1',
        orderId: 'ORD-9012',
        message: 'Where is package?',
        status: 'PENDING',
        createdAt: '2026-11-02T10:00:00Z',
        updatedAt: '2026-11-02T10:00:00Z',
        customer: {
          id: 'c-1',
          externalId: 'USR-101',
          name: 'John',
          currentTier: 'Free',
          createdAt: '',
          updatedAt: '',
        },
      },
      {
        id: 't-2',
        ticketNumber: 'TCK-002',
        customerId: 'c-2',
        orderId: null,
        message: 'Upgrade please',
        status: 'RESOLVED',
        createdAt: '2026-11-02T10:00:00Z',
        updatedAt: '2026-11-02T10:00:00Z',
        customer: {
          id: 'c-2',
          externalId: 'USR-204',
          name: 'Sarah',
          currentTier: 'Free',
          createdAt: '',
          updatedAt: '',
        },
      },
      {
        id: 't-3',
        ticketNumber: 'TCK-003',
        customerId: 'c-3',
        orderId: null,
        message: 'Profile picture update',
        status: 'PROCESSING',
        createdAt: '2026-11-02T10:00:00Z',
        updatedAt: '2026-11-02T10:00:00Z',
        customer: {
          id: 'c-3',
          externalId: 'USR-309',
          name: 'David',
          currentTier: 'Free',
          createdAt: '',
          updatedAt: '',
        },
      },
    ];

    vi.spyOn(ticketHooks, 'useTickets').mockReturnValue({
      data: { tickets: mockTickets, total: 3 },
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof ticketHooks.useTickets>);

    render(<SummaryCards />);

    expect(screen.getByText('Total Tickets')).toBeInTheDocument();
    expect(screen.getByText('Pending Triage')).toBeInTheDocument();
    expect(screen.getByText('In Processing')).toBeInTheDocument();
    expect(screen.getByText('Resolved')).toBeInTheDocument();
    expect(screen.getByText('Failed Triage')).toBeInTheDocument();

    const counts = screen.getAllByText('1');
    expect(counts.length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});