import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types';

export interface SystemInfo {
  status: string;
  database: string;
  geminiModel: string;
  nodeEnv: string;
  uptimeSeconds: number;
  counts: {
    tickets: number;
    executions: number;
    customers: number;
  };
}

export interface SystemActionResult {
  message: string;
  ticketsCount?: number;
  seededTickets?: number;
  seededCustomers?: number;
}

export async function fetchSystemInfo(): Promise<SystemInfo> {
  const response = await apiClient.get<ApiResponse<SystemInfo>>('/system/info');
  return response.data.data;
}

export async function resetToPending(): Promise<SystemActionResult> {
  const response = await apiClient.post<ApiResponse<SystemActionResult>>(
    '/system/reset-to-pending'
  );
  return response.data.data;
}

export async function reseedDatabase(): Promise<SystemActionResult> {
  const response = await apiClient.post<ApiResponse<SystemActionResult>>(
    '/system/reseed'
  );
  return response.data.data;
}

export async function clearAllData(): Promise<SystemActionResult> {
  const response = await apiClient.post<ApiResponse<SystemActionResult>>(
    '/system/clear-all'
  );
  return response.data.data;
}

