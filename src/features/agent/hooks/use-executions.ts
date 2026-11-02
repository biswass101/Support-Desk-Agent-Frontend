import { useQuery } from '@tanstack/react-query';
import {
  fetchTicketExecutions,
  fetchExecutionDetail,
  fetchAllExecutions,
} from '../services/agent.service';

export function useTicketExecutions(ticketNumber: string) {
  return useQuery({
    queryKey: ['ticket-executions', ticketNumber],
    queryFn: () => fetchTicketExecutions(ticketNumber),
    enabled: Boolean(ticketNumber),
  });
}

export function useExecutionDetail(executionId: string | null) {
  return useQuery({
    queryKey: ['execution-detail', executionId],
    queryFn: () => (executionId ? fetchExecutionDetail(executionId) : null),
    enabled: Boolean(executionId),
  });
}

export function useAllExecutions() {
  return useQuery({
    queryKey: ['all-executions'],
    queryFn: () => fetchAllExecutions(),
  });
}
