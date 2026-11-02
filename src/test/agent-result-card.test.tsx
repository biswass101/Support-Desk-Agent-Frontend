import React, { act } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AgentResultCard } from '@/features/agent/components/agent-result-card';
import { AgentExecution } from '@/types';

describe('AgentResultCard Component', () => {
  const mockExecution: AgentExecution = {
    id: 'exec-12345678',
    ticketId: 'tick-1',
    status: 'COMPLETED',
    resolutionTag: 'AUTO_RESOLVE',
    customerResponse: 'Your package for order #ORD-9012 is currently in transit.',
    summary: 'Retrieved order status and informed the customer.',
    errorMessage: null,
    startedAt: '2026-11-02T10:00:00Z',
    completedAt: '2026-11-02T10:00:05Z',
    createdAt: '2026-11-02T10:00:00Z',
    ticket: {
      id: 'tick-1',
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
    traces: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders customer response draft and agent summary', () => {
    render(<AgentResultCard execution={mockExecution} />);

    expect(screen.getByText('Customer Response Draft')).toBeInTheDocument();
    expect(screen.getByText('Your package for order #ORD-9012 is currently in transit.')).toBeInTheDocument();
    expect(screen.getByText('Agent Synthesis Summary')).toBeInTheDocument();
    expect(screen.getByText('Retrieved order status and informed the customer.')).toBeInTheDocument();
    expect(screen.getByText('Auto-Resolve')).toBeInTheDocument();
  });

  it('renders copy button and handles clipboard copying', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<AgentResultCard execution={mockExecution} />);

    const copyBtn = screen.getByRole('button', { name: /copy response/i });
    expect(copyBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(copyBtn);
    });
    expect(writeTextMock).toHaveBeenCalledWith('Your package for order #ORD-9012 is currently in transit.');
  });

  it('renders failed execution error message when status is FAILED', () => {
    const failedExecution: AgentExecution = {
      ...mockExecution,
      status: 'FAILED',
      errorMessage: 'Network timeout calling Gemini API',
      customerResponse: null,
      summary: null,
    };

    render(<AgentResultCard execution={failedExecution} />);

    expect(screen.getByText('Triage Execution Failed')).toBeInTheDocument();
    expect(screen.getByText('Network timeout calling Gemini API')).toBeInTheDocument();
  });
});