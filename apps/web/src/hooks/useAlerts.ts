import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '../lib/api-client';

export interface Alert {
  id: string;
  symbol: string;
  condition: 'ABOVE' | 'BELOW' | 'CROSS';
  price: number;
  message: string;
  createdAt: string;
  triggered: boolean;
}

export function useAlerts() {
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data } = await api.get<Alert[]>('/alerts');
      return data;
    },
  });

  const createAlert = useMutation({
    mutationFn: async (newAlert: Omit<Alert, 'id' | 'createdAt'>) => {
      const { data } = await api.post('/alerts', newAlert);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  const deleteAlert = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/alerts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  return {
    alerts,
    isLoading,
    createAlert,
    deleteAlert,
  };
}
