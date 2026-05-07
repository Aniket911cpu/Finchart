import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '../lib/api-client';
export function useAlerts() {
    const queryClient = useQueryClient();
    const { data: alerts, isLoading } = useQuery({
        queryKey: ['alerts'],
        queryFn: async () => {
            const { data } = await api.get('/alerts');
            return data;
        },
    });
    const createAlert = useMutation({
        mutationFn: async (newAlert) => {
            const { data } = await api.post('/alerts', newAlert);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alerts'] });
        },
    });
    const deleteAlert = useMutation({
        mutationFn: async (id) => {
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
//# sourceMappingURL=useAlerts.js.map