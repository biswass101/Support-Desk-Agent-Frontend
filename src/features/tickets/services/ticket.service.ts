import { apiClient } from '@/lib/axios';
import { ApiResponse, Ticket, TicketDetail, TicketFilters } from '@/types';

export async function fetchTickets(filters?: TicketFilters): Promise<{
  tickets: Ticket[];
  total: number;
}> {
  const params: Record<string, string> = {};
  if (filters?.status && filters.status !== 'ALL') {
    params.status = filters.status;
  }
  if (filters?.search && filters.search.trim().length > 0) {
    params.search = filters.search.trim();
  }

  const response = await apiClient.get<ApiResponse<Ticket[]>>('/tickets', { params });
  return {
    tickets: response.data.data,
    total: response.data.meta?.count ?? response.data.data.length,
  };
}

export async function fetchTicketByNumber(ticketNumber: string): Promise<TicketDetail> {
  const response = await apiClient.get<ApiResponse<TicketDetail>>(`/tickets/${ticketNumber}`);
  return response.data.data;
}
