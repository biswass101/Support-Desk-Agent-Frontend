import { useQuery } from '@tanstack/react-query';
import { fetchTickets, fetchTicketByNumber } from '../services/ticket.service';
import { TicketFilters } from '@/types';

export function useTickets(filters?: TicketFilters) {
  return useQuery({
    queryKey: ['tickets', filters?.status, filters?.search],
    queryFn: () => fetchTickets(filters),
  });
}

export function useTicketDetail(ticketNumber: string) {
  return useQuery({
    queryKey: ['ticket', ticketNumber],
    queryFn: () => fetchTicketByNumber(ticketNumber),
    enabled: Boolean(ticketNumber),
  });
}
