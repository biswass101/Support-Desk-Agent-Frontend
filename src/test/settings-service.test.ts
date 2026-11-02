import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchSystemInfo,
  resetToPending,
  reseedDatabase,
  clearAllData,
} from '@/features/settings/services/settings.service';
import { apiClient } from '@/lib/axios';

vi.mock('@/lib/axios', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('Settings Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchSystemInfo calls GET /system/info and returns data', async () => {
    const mockInfo = {
      status: 'healthy',
      database: 'connected',
      geminiModel: 'gemini-3.5-flash-lite',
      nodeEnv: 'development',
      uptimeSeconds: 300,
      counts: { tickets: 3, executions: 5, customers: 3 },
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { success: true, data: mockInfo },
    });

    const result = await fetchSystemInfo();
    expect(apiClient.get).toHaveBeenCalledWith('/system/info');
    expect(result).toEqual(mockInfo);
  });

  it('resetToPending calls POST /system/reset-to-pending', async () => {
    const mockResponse = {
      message: 'Database reset to pending triage state successfully',
      ticketsCount: 3,
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: { success: true, data: mockResponse },
    });

    const result = await resetToPending();
    expect(apiClient.post).toHaveBeenCalledWith('/system/reset-to-pending');
    expect(result).toEqual(mockResponse);
  });

  it('reseedDatabase calls POST /system/reseed', async () => {
    const mockResponse = {
      message: 'Evaluation dataset re-seeded successfully',
      seededTickets: 3,
      seededCustomers: 3,
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: { success: true, data: mockResponse },
    });

    const result = await reseedDatabase();
    expect(apiClient.post).toHaveBeenCalledWith('/system/reseed');
    expect(result).toEqual(mockResponse);
  });

  it('clearAllData calls POST /system/clear-all', async () => {
    const mockResponse = {
      message: 'All database records cleared successfully',
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: { success: true, data: mockResponse },
    });

    const result = await clearAllData();
    expect(apiClient.post).toHaveBeenCalledWith('/system/clear-all');
    expect(result).toEqual(mockResponse);
  });
});

