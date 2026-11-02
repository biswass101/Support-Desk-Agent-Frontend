import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ActivityPage from '@/app/activity/page';
import * as executionHooks from '@/features/agent/hooks/use-executions';
import { AgentExecution } from '@/types';

vi.mock('@/features/agent/hooks/use-executions', () => ({
  useAllExecutions: vi.fn(),
}));

describe('ActivityPage Component', () => {
  const mockExecutions: AgentExecution[] = [
    {
      id: 'exec-aaa-111',
      ticketId: 't-1',
      status: 'COMPLETED',
      resolutionTag: 'AUTO_RESOLVE',
      customerResponse: 'Your order has arrived.',
      summary: 'Verified tracking and resolved.',
      errorMessage: null,
      startedAt: '2026-11-02T10:00:00Z',
      completedAt: '2026-11-02T10:00:03Z',
      createdAt: '2026-11-02T10:00:00Z',
      ticket: {
        id: 't-1',
        ticketNumber: 'TCK-001',
        customerId: 'c-1',
        orderId: 'ORD-9012',
        message: 'Where is my order?',
        status: 'RESOLVED',
        createdAt: '',
        updatedAt: '',
        customer: {
          id: 'c-1',
          externalId: 'USR-101',
          name: 'Alice',
          currentTier: 'Free',
          createdAt: '',
          updatedAt: '',
        },
      },
      traces: [],
    },
    {
      id: 'exec-bbb-222',
      ticketId: 't-2',
      status: 'COMPLETED',
      resolutionTag: 'ESCALATE_TO_SALES',
      customerResponse: 'Escalated to sales team.',
      summary: 'Pro tier upgrade request routed to sales.',
      errorMessage: null,
      startedAt: '2026-11-02T11:00:00Z',
      completedAt: '2026-11-02T11:00:04Z',
      createdAt: '2026-11-02T11:00:00Z',
      ticket: {
        id: 't-2',
        ticketNumber: 'TCK-002',
        customerId: 'c-2',
        orderId: null,
        message: 'I want to upgrade my tier.',
        status: 'RESOLVED',
        createdAt: '',
        updatedAt: '',
        customer: {
          id: 'c-2',
          externalId: 'USR-204',
          name: 'Bob',
          currentTier: 'Free',
          createdAt: '',
          updatedAt: '',
        },
      },
      traces: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders summary statistics and executions list', () => {
    vi.spyOn(executionHooks, 'useAllExecutions').mockReturnValue({
      data: mockExecutions,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof executionHooks.useAllExecutions>);

    render(<ActivityPage />);

    expect(screen.getByText('Agent Activity & Audit Trail')).toBeInTheDocument();
    expect(screen.getByText('TCK-001')).toBeInTheDocument();
    expect(screen.getByText('TCK-002')).toBeInTheDocument();
    expect(screen.getAllByText('Auto-Resolve').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Escalate to Sales').length).toBeGreaterThanOrEqual(1);
  });

  it('filters executions by search query', () => {
    vi.spyOn(executionHooks, 'useAllExecutions').mockReturnValue({
      data: mockExecutions,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof executionHooks.useAllExecutions>);

    render(<ActivityPage />);

    const searchInput = screen.getByPlaceholderText(/search ticket #/i);
    fireEvent.change(searchInput, { target: { value: 'TCK-001' } });

    expect(screen.getByText('TCK-001')).toBeInTheDocument();
    expect(screen.queryByText('TCK-002')).not.toBeInTheDocument();
  });

  it('renders loading state properly', () => {
    vi.spyOn(executionHooks, 'useAllExecutions').mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof executionHooks.useAllExecutions>);

    const { container } = render(<ActivityPage />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });
});
