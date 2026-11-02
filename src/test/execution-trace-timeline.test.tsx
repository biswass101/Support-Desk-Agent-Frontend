import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExecutionTraceTimeline } from '@/features/agent/components/execution-trace-timeline';
import { ExecutionTrace } from '@/types';

describe('ExecutionTraceTimeline Component', () => {
  const mockTraces: ExecutionTrace[] = [
    {
      id: 'trace-1',
      executionId: 'exec-1',
      step: 1,
      eventType: 'AGENT_DECISION',
      toolName: null,
      message: 'Analyzing ticket context for order status query.',
      parameters: null,
      output: null,
      durationMs: 120,
      createdAt: '2026-11-02T10:00:01Z',
    },
    {
      id: 'trace-2',
      executionId: 'exec-1',
      step: 2,
      eventType: 'TOOL_CALL',
      toolName: 'get_order_status',
      message: 'Invoking get_order_status with orderId ORD-9012.',
      parameters: { orderId: 'ORD-9012' },
      output: null,
      durationMs: 45,
      createdAt: '2026-11-02T10:00:02Z',
    },
    {
      id: 'trace-3',
      executionId: 'exec-1',
      step: 3,
      eventType: 'TOOL_RESULT',
      toolName: 'get_order_status',
      message: 'Received response from get_order_status.',
      parameters: null,
      output: { status: 'Delivered', deliveredAt: '2026-11-01' },
      durationMs: 15,
      createdAt: '2026-11-02T10:00:03Z',
    },
    {
      id: 'trace-4',
      executionId: 'exec-1',
      step: 4,
      eventType: 'AGENT_RESPONSE',
      toolName: null,
      message: 'Generated customer response confirming delivery status.',
      parameters: null,
      output: null,
      durationMs: 250,
      createdAt: '2026-11-02T10:00:04Z',
    },
  ];

  it('renders all trace steps with step numbers and messages', () => {
    render(
      <ExecutionTraceTimeline
        traces={mockTraces}
        startedAt="2026-11-02T10:00:00Z"
        completedAt="2026-11-02T10:00:05Z"
      />
    );

    expect(screen.getByText('Agent Execution Trace')).toBeInTheDocument();
    expect(screen.getByText('4 Steps')).toBeInTheDocument();
    expect(screen.getByText('1 Tool Invocation')).toBeInTheDocument();

    expect(screen.getByText('Agent Decision')).toBeInTheDocument();
    expect(screen.getByText('Analyzing ticket context for order status query.')).toBeInTheDocument();

    expect(screen.getByText('Tool Call')).toBeInTheDocument();
    expect(screen.getAllByText('get_order_status').length).toBeGreaterThan(0);

    expect(screen.getByText('Tool Result')).toBeInTheDocument();
    expect(screen.getByText('Final Response')).toBeInTheDocument();
  });

  it('renders error event gracefully when trace contains an ERROR', () => {
    const errorTraces: ExecutionTrace[] = [
      {
        id: 'trace-err',
        executionId: 'exec-err',
        step: 1,
        eventType: 'ERROR',
        toolName: null,
        message: 'Gemini function calling timeout exceeded.',
        parameters: null,
        output: null,
        durationMs: 5000,
        createdAt: '2026-11-02T10:00:01Z',
      },
    ];

    render(<ExecutionTraceTimeline traces={errorTraces} />);

    expect(screen.getByText('Execution Error')).toBeInTheDocument();
    expect(screen.getByText('Gemini function calling timeout exceeded.')).toBeInTheDocument();
  });

  it('handles executions with zero tool calls gracefully', () => {
    const directTraces: ExecutionTrace[] = [
      {
        id: 'trace-direct-1',
        executionId: 'exec-direct',
        step: 1,
        eventType: 'AGENT_DECISION',
        toolName: null,
        message: 'Ticket is a general FAQ inquiry. No tool calls necessary.',
        parameters: null,
        output: null,
        durationMs: 80,
        createdAt: '2026-11-02T10:00:01Z',
      },
      {
        id: 'trace-direct-2',
        executionId: 'exec-direct',
        step: 2,
        eventType: 'AGENT_RESPONSE',
        toolName: null,
        message: 'Directly synthesized customer response.',
        parameters: null,
        output: null,
        durationMs: 140,
        createdAt: '2026-11-02T10:00:02Z',
      },
    ];

    render(<ExecutionTraceTimeline traces={directTraces} />);

    expect(screen.getByText('2 Steps')).toBeInTheDocument();
    expect(screen.getByText('0 Tools (Direct Answer)')).toBeInTheDocument();
    expect(screen.getByText('Ticket is a general FAQ inquiry. No tool calls necessary.')).toBeInTheDocument();
  });

  it('renders empty state when traces array is empty', () => {
    render(<ExecutionTraceTimeline traces={[]} />);
    expect(screen.getByText('0 Steps')).toBeInTheDocument();
    expect(
      screen.getByText('No execution trace steps recorded for this session.')
    ).toBeInTheDocument();
  });
});

