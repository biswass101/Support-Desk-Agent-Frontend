import { apiClient } from '@/lib/axios';
import { ApiResponse, HealthCheckData } from '@/types/api';

export async function fetchHealth(): Promise<HealthCheckData> {
  const response = await apiClient.get<ApiResponse<HealthCheckData>>('/health');
  return response.data.data;
}
