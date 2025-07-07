import { useQuery } from '@tanstack/react-query';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const useUserEvents = () => {
  const { user, isAuthenticated } = useAuth();

  console.log('🔍 useUserEvents - Usuário:', user?.username);
  console.log('🔍 useUserEvents - Autenticado:', isAuthenticated);

  const {
    data: events = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['events', 'user'],
    queryFn: async () => {
      console.log('🚀 Buscando eventos do usuário...');
      const result = await apiService.getUserEvents();
      console.log('✅ Eventos obtidos:', result);
      return result;
    },
    enabled: isAuthenticated && !!user,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    events,
    isLoading,
    error,
    refetch,
    hasEvents: events.length > 0,
    eventCount: events.length,
  };
}; 