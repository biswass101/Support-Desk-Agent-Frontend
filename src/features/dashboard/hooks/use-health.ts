import { useQuery } from '@tanstack/react-query';
import { fetchHealth } from '../services/health.service';

export function useHealth() {
  return useQuery({
    queryKey: ['backend-health'],
    queryFn: fetchHealth,
    refetchInterval: 30000,
    retry: 1,
  });
}
