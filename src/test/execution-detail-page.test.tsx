import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExecutionDetailPage from '@/app/executions/[executionId]/page';
import * as executionHooks from '@/features/agent/hooks/use-executions';
import { AgentExecution } from '@/types';

vi.mock('next/navigation', () => ({
  useParams: () => ({ executionId: 'exec-12345678' }),
}));

vi.mock('@/features/agent/hooks/use-executions', () => ({
  useExecutionDetail: vi.fn(),
}));

describe('ExecutionDetailPage Component', () => {
  const mockExecution: AgentExecution = {
    id: 'exec-12345678',
    ticketId: 't-1',
    status: 'COMPLETED',
    resolutionTag: 'AUTO_RESOLVE',
    customerResponse: 'Your order is on the way.',
    summary: 'Tracked package and confirmed in transit.',
    errorMessage: null,
    startedAt: '2026-11-02T10:00:00Z',
    completedAt: '2026-11-02T10:00:04Z',
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
        name: 'John Doe',
        currentTier: 'Free',
        createdAt: '',
        updatedAt: '',
      },
    },
    traces: [
      {
        id: 'trace-1',
        executionId: 'exec-12345678',
        step: 1,
        eventType: 'AGENT_DECISION',
        toolName: null,
        message: 'Looking up order',
        parameters: null,
        output: null,
        durationMs: 40,
        createdAt: '2026-11-02T10:00:01Z',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when fetching execution details', () => {
    vi.spyOn(executionHooks, 'useExecutionDetail').mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof executionHooks.useExecutionDetail>);

    const { container } = render(<ExecutionDetailPage />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders error state when execution is missing', () => {
    vi.spyOn(executionHooks, 'useExecutionDetail').mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof executionHooks.useExecutionDetail>);

    render(<ExecutionDetailPage />);
    expect(screen.getByText('Execution Not Found')).toBeInTheDocument();
  });

  it('renders audit view with ticket context and trace timeline', () => {
    vi.spyOn(executionHooks, 'useExecutionDetail').mockReturnValue({
      data: mockExecution,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof executionHooks.useExecutionDetail>);

    render(<ExecutionDetailPage />);

    expect(screen.getByText('Audit #exec-123')).toBeInTheDocument();
    expect(screen.getAllByText(/TCK-001/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Customer Response Draft')).toBeInTheDocument();
    expect(screen.getByText('Agent Execution Trace')).toBeInTheDocument();
    expect(screen.getByText('Looking up order')).toBeInTheDocument();
  });
});
