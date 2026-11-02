import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExecutionHistoryList } from '@/features/executions/components/execution-history-list';
import { AgentExecutionSummary } from '@/types';

describe('ExecutionHistoryList Component', () => {
  const mockExecutions: AgentExecutionSummary[] = [
    {
      id: 'exec-11112222',
      ticketId: 't-1',
      status: 'COMPLETED',
      resolutionTag: 'AUTO_RESOLVE',
      customerResponse: 'Your order has been shipped.',
      summary: 'Order shipped.',
      errorMessage: null,
      startedAt: '2026-11-02T10:00:00Z',
      completedAt: '2026-11-02T10:00:03Z',
      createdAt: '2026-11-02T10:00:00Z',
      traces: [
        {
          id: 't-1',
          executionId: 'exec-11112222',
          step: 1,
          eventType: 'AGENT_DECISION',
          toolName: null,
          message: 'Decision step',
          parameters: null,
          output: null,
          durationMs: 100,
          createdAt: '',
        },
      ],
    },
    {
      id: 'exec-33334444',
      ticketId: 't-2',
      status: 'FAILED',
      resolutionTag: null,
      customerResponse: null,
      summary: null,
      errorMessage: 'Network timeout',
      startedAt: '2026-11-02T09:00:00Z',
      completedAt: '2026-11-02T09:00:05Z',
      createdAt: '2026-11-02T09:00:00Z',
      traces: [],
    },
  ];

  it('renders nothing when executions array is empty', () => {
    const { container } = render(<ExecutionHistoryList executions={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders list of executions with status, resolution, and traces count', () => {
    render(<ExecutionHistoryList executions={mockExecutions} />);

    expect(screen.getByText('Execution History')).toBeInTheDocument();
    expect(screen.getByText('2 Runs')).toBeInTheDocument();
    expect(screen.getByText('#exec-111')).toBeInTheDocument();
    expect(screen.getByText('#exec-333')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('Auto-Resolve')).toBeInTheDocument();
    expect(screen.getByText('1 trace steps')).toBeInTheDocument();
    expect(screen.getByText('0 trace steps')).toBeInTheDocument();
  });

  it('triggers onSelectExecution when an execution item is clicked', () => {
    const onSelect = vi.fn();
    render(
      <ExecutionHistoryList
        executions={mockExecutions}
        onSelectExecution={onSelect}
      />
    );

    const secondItem = screen.getByText('#exec-333');
    fireEvent.click(secondItem);
    expect(onSelect).toHaveBeenCalledWith('exec-33334444');
  });
});
