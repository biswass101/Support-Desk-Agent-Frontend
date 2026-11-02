'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { triageTicket } from '../services/agent.service';
import { extractErrorMessage } from '@/lib/axios';
import { AgentExecution } from '@/types';

interface UseTriageOptions {
  onSuccess?: (execution: AgentExecution) => void;
  onError?: (error: Error) => void;
}

export function useTriageTicket(ticketNumber: string, options?: UseTriageOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => triageTicket(ticketNumber),
    onSuccess: (data) => {
      queryClient.setQueryData(['ticket', ticketNumber], (prev: unknown) => {
        if (!prev) return prev;
        return {
          ...(prev as Record<string, unknown>),
          status: data.ticket?.status || 'RESOLVED',
          updatedAt: data.ticket?.updatedAt || new Date().toISOString(),
        };
      });

      queryClient.invalidateQueries({ queryKey: ['ticket', ticketNumber] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket-executions', ticketNumber] });

      toast.success(`Ticket ${ticketNumber} triaged successfully`);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || `Failed to triage ticket ${ticketNumber}`);

      queryClient.invalidateQueries({ queryKey: ['ticket', ticketNumber] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });

      options?.onError?.(error instanceof Error ? error : new Error(message));
    },
  });
}
