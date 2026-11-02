import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TicketList } from '@/features/tickets/components/ticket-list';
import * as ticketHooks from '@/features/tickets/hooks/use-tickets';
import { Ticket } from '@/types';

vi.mock('@/features/tickets/hooks/use-tickets', () => ({
  useTickets: vi.fn(),
  useTicketDetail: vi.fn(),
}));

describe('TicketList Component', () => {
  const mockTickets: Ticket[] = [
    {
      id: 't-101',
      ticketNumber: 'TCK-001',
      customerId: 'c-101',
      orderId: 'ORD-9012',
      message: 'Where is my package #ORD-9012?',
      status: 'PENDING',
      createdAt: '2026-11-02T10:00:00Z',
      updatedAt: '2026-11-02T10:00:00Z',
      customer: {
        id: 'c-101',
        externalId: 'USR-101',
        name: 'John Doe',
        currentTier: 'Free',
        createdAt: '',
        updatedAt: '',
      },
    },
    {
      id: 't-204',
      ticketNumber: 'TCK-002',
      customerId: 'c-204',
      orderId: null,
      message: 'Can you upgrade my account to Enterprise tier?',
      status: 'RESOLVED',
      createdAt: '2026-11-02T10:00:00Z',
      updatedAt: '2026-11-02T10:00:00Z',
      customer: {
        id: 'c-204',
        externalId: 'USR-204',
        name: 'Sarah Smith',
        currentTier: 'Free',
        createdAt: '',
        updatedAt: '',
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeletons when fetching tickets', () => {
    vi.spyOn(ticketHooks, 'useTickets').mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof ticketHooks.useTickets>);

    const { container } = render(<TicketList />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders ticket cards with ticketNumber, customer, and message', () => {
    vi.spyOn(ticketHooks, 'useTickets').mockReturnValue({
      data: { tickets: mockTickets, total: 2 },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof ticketHooks.useTickets>);

    render(<TicketList />);

    expect(screen.getByText('TCK-001')).toBeInTheDocument();
    expect(screen.getByText(/Where is my package #ORD-9012\?/i)).toBeInTheDocument();
    expect(screen.getByText('ORD-9012')).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();

    expect(screen.getByText('TCK-002')).toBeInTheDocument();
    expect(screen.getByText(/Can you upgrade my account to Enterprise tier\?/i)).toBeInTheDocument();
  });

  it('renders empty state when no tickets match filters', () => {
    vi.spyOn(ticketHooks, 'useTickets').mockReturnValue({
      data: { tickets: [], total: 0 },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof ticketHooks.useTickets>);

    render(<TicketList initialFilters={{ status: 'FAILED', search: '' }} />);

    expect(screen.getByText('No Tickets Found')).toBeInTheDocument();
    expect(screen.getByText(/No support tickets match your current search/i)).toBeInTheDocument();
  });

  it('renders error state and handles retry request', () => {
    const mockRefetch = vi.fn();
    vi.spyOn(ticketHooks, 'useTickets').mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: mockRefetch,
      isFetching: false,
    } as unknown as ReturnType<typeof ticketHooks.useTickets>);

    render(<TicketList />);

    expect(screen.getByText('Failed to Load Tickets')).toBeInTheDocument();
    const retryBtn = screen.getByRole('button', { name: /retry request/i });
    fireEvent.click(retryBtn);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});
