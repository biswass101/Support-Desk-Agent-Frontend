import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TicketDetailView } from '@/features/tickets/components/ticket-detail-view';
import * as ticketHooks from '@/features/tickets/hooks/use-tickets';
import * as triageHooks from '@/features/agent/hooks/use-triage';
import * as executionHooks from '@/features/agent/hooks/use-executions';
import { TicketDetail } from '@/types';

vi.mock('@/features/tickets/hooks/use-tickets', () => ({
  useTickets: vi.fn(),
  useTicketDetail: vi.fn(),
}));

vi.mock('@/features/agent/hooks/use-triage', () => ({
  useTriageTicket: vi.fn(),
}));

vi.mock('@/features/agent/hooks/use-executions', () => ({
  useTicketExecutions: vi.fn(),
  useExecutionDetail: vi.fn(),
}));

describe('TicketDetailView Component', () => {
  const mockTicket: TicketDetail = {
    id: 'ticket-101',
    ticketNumber: 'TCK-001',
    customerId: 'cust-101',
    orderId: 'ORD-9012',
    message: 'Where is my package #ORD-9012? It was supposed to arrive yesterday.',
    status: 'PENDING',
    createdAt: '2026-11-02T10:00:00Z',
    updatedAt: '2026-11-02T10:00:00Z',
    customer: {
      id: 'cust-101',
      externalId: 'USR-101',
      name: 'John Doe',
      currentTier: 'Free',
      createdAt: '',
      updatedAt: '',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(triageHooks, 'useTriageTicket').mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof triageHooks.useTriageTicket>);

    vi.spyOn(executionHooks, 'useTicketExecutions').mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof executionHooks.useTicketExecutions>);

    vi.spyOn(executionHooks, 'useExecutionDetail').mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof executionHooks.useExecutionDetail>);
  });

  it('renders loading state when fetching ticket details', () => {
    vi.spyOn(ticketHooks, 'useTicketDetail').mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof ticketHooks.useTicketDetail>);

    const { container } = render(<TicketDetailView ticketNumber="TCK-001" />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders error state when ticket is not found', () => {
    vi.spyOn(ticketHooks, 'useTicketDetail').mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof ticketHooks.useTicketDetail>);

    render(<TicketDetailView ticketNumber="TCK-999" />);
    expect(screen.getByText('Ticket Not Found')).toBeInTheDocument();
  });

  it('renders ticket details, customer metadata, and order reference', () => {
    vi.spyOn(ticketHooks, 'useTicketDetail').mockReturnValue({
      data: mockTicket,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof ticketHooks.useTicketDetail>);

    render(<TicketDetailView ticketNumber="TCK-001" />);

    expect(screen.getByText('TCK-001')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText(/Where is my package #ORD-9012\?/i)).toBeInTheDocument();
    expect(screen.getByText('USR-101')).toBeInTheDocument();
    expect(screen.getByText('ORD-9012')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /run ai triage agent/i })).toBeInTheDocument();
  });

  it('handles run triage agent click', () => {
    const mockMutate = vi.fn();
    vi.spyOn(triageHooks, 'useTriageTicket').mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof triageHooks.useTriageTicket>);

    vi.spyOn(ticketHooks, 'useTicketDetail').mockReturnValue({
      data: mockTicket,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof ticketHooks.useTicketDetail>);

    render(<TicketDetailView ticketNumber="TCK-001" />);
    const runBtn = screen.getByRole('button', { name: /run ai triage agent/i });
    fireEvent.click(runBtn);
    expect(mockMutate).toHaveBeenCalledTimes(1);
  });

  it('shows processing spinner when triage is running', () => {
    vi.spyOn(triageHooks, 'useTriageTicket').mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof triageHooks.useTriageTicket>);

    vi.spyOn(ticketHooks, 'useTicketDetail').mockReturnValue({
      data: mockTicket,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof ticketHooks.useTicketDetail>);

    render(<TicketDetailView ticketNumber="TCK-001" />);
    expect(screen.getByText(/agent processing\.\.\./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /agent processing\.\.\./i })).toBeDisabled();
  });
});
