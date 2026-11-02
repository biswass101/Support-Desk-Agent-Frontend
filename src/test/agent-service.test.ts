import { describe, it, expect, vi, beforeEach } from 'vitest';
import { triageTicket, fetchTicketExecutions, fetchExecutionDetail } from '@/features/agent/services/agent.service';
import { apiClient } from '@/lib/axios';

vi.mock('@/lib/axios', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
  extractErrorMessage: vi.fn((err: unknown) => (err as { message?: string })?.message || 'Error'),
}));

describe('Agent Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('triageTicket sends POST request to correct endpoint', async () => {
    const mockExecution = { id: 'exec-1', ticketId: 'tick-1', status: 'COMPLETED' };
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: { success: true, data: mockExecution },
    });

    const result = await triageTicket('TCK-001');
    expect(apiClient.post).toHaveBeenCalledWith('/tickets/TCK-001/triage');
    expect(result).toEqual(mockExecution);
  });

  it('fetchTicketExecutions sends GET request to correct endpoint', async () => {
    const mockList = [{ id: 'exec-1', status: 'COMPLETED' }];
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { success: true, data: mockList },
    });

    const result = await fetchTicketExecutions('TCK-001');
    expect(apiClient.get).toHaveBeenCalledWith('/tickets/TCK-001/executions');
    expect(result).toEqual(mockList);
  });

  it('fetchExecutionDetail sends GET request with executionId', async () => {
    const mockDetail = { id: 'exec-1', traces: [] };
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { success: true, data: mockDetail },
    });

    const result = await fetchExecutionDetail('exec-1');
    expect(apiClient.get).toHaveBeenCalledWith('/executions/exec-1');
    expect(result).toEqual(mockDetail);
  });
});