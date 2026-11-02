import { apiClient } from '@/lib/axios';
import { ApiResponse, AgentExecution, AgentExecutionSummary } from '@/types';

export async function triageTicket(ticketNumber: string): Promise<AgentExecution> {
  const response = await apiClient.post<ApiResponse<AgentExecution>>(
    `/tickets/${ticketNumber}/triage`
  );
  return response.data.data;
}

export async function fetchTicketExecutions(
  ticketNumber: string
): Promise<AgentExecutionSummary[]> {
  const response = await apiClient.get<ApiResponse<AgentExecutionSummary[]>>(
    `/tickets/${ticketNumber}/executions`
  );
  return response.data.data;
}

export async function fetchExecutionDetail(
  executionId: string
): Promise<AgentExecution> {
  const response = await apiClient.get<ApiResponse<AgentExecution>>(
    `/executions/${executionId}`
  );
  return response.data.data;
}

export async function fetchAllExecutions(): Promise<AgentExecution[]> {
  const response = await apiClient.get<ApiResponse<AgentExecution[]>>('/executions');
  return response.data.data;
}
