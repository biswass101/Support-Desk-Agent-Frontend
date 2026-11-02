import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchSystemInfo,
  resetToPending,
  reseedDatabase,
  clearAllData,
  SystemActionResult,
} from '../services/settings.service';
import { toast } from 'sonner';

export function useSystemInfo() {
  return useQuery({
    queryKey: ['system-info'],
    queryFn: () => fetchSystemInfo(),
  });
}

export function useResetToPending() {
  const queryClient = useQueryClient();

  return useMutation<SystemActionResult, Error>({
    mutationFn: () => resetToPending(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['system-info'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
      queryClient.invalidateQueries({ queryKey: ['all-executions'] });
      queryClient.invalidateQueries({ queryKey: ['ticket-executions'] });
      queryClient.invalidateQueries({ queryKey: ['execution-detail'] });
      toast.success(data.message || 'Database reset to pending triage state.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to reset database.');
    },
  });
}

export function useReseedDatabase() {
  const queryClient = useQueryClient();

  return useMutation<SystemActionResult, Error>({
    mutationFn: () => reseedDatabase(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['system-info'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
      queryClient.invalidateQueries({ queryKey: ['all-executions'] });
      queryClient.invalidateQueries({ queryKey: ['ticket-executions'] });
      queryClient.invalidateQueries({ queryKey: ['execution-detail'] });
      toast.success(data.message || 'Sample dataset restored successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to re-seed database.');
    },
  });
}

export function useClearAllData() {
  const queryClient = useQueryClient();

  return useMutation<SystemActionResult, Error>({
    mutationFn: () => clearAllData(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['system-info'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
      queryClient.invalidateQueries({ queryKey: ['all-executions'] });
      queryClient.invalidateQueries({ queryKey: ['ticket-executions'] });
      queryClient.invalidateQueries({ queryKey: ['execution-detail'] });
      toast.success(data.message || 'All database records cleared.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to clear database records.');
    },
  });
}

