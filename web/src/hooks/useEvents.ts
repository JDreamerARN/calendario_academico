import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';
import { CreateEventRequest, UpdateEventRequest } from '../types';
import { useUserEvents } from './useUserEvents';

export const useEvents = () => {
  const queryClient = useQueryClient();
  const { events, isLoading, error, refetch, hasEvents, eventCount } = useUserEvents();

  // Buscar eventos acadêmicos
  const {
    data: academicEvents = [],
    isLoading: isLoadingAcademic,
  } = useQuery({
    queryKey: ['events', 'academic'],
    queryFn: apiService.getAcademicEvents,
  });

  // Buscar eventos de festa
  const {
    data: partyEvents = [],
    isLoading: isLoadingParty,
  } = useQuery({
    queryKey: ['events', 'party'],
    queryFn: apiService.getPartyEvents,
  });

  // Criar evento
  const createEventMutation = useMutation({
    mutationFn: (eventData: CreateEventRequest) => apiService.createEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'user'] });
    },
  });

  // Função para criar evento com callbacks opcionais
  const createEvent = (
    eventData: CreateEventRequest,
    callbacks?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }
  ) => {
    console.log('🚀 Hook useEvents - Iniciando criação de evento');
    console.log('📋 Dados recebidos:', eventData);
    
    createEventMutation.mutate(eventData, {
      onSuccess: (data) => {
        console.log('✅ Hook useEvents - Evento criado com sucesso:', data);
        callbacks?.onSuccess?.();
      },
      onError: (error) => {
        console.error('❌ Hook useEvents - Erro ao criar evento:', error);
        callbacks?.onError?.(error as Error);
      },
    });
  };

  // Atualizar evento
  const updateEventMutation = useMutation({
    mutationFn: ({ id, eventData }: { id: number; eventData: UpdateEventRequest }) =>
      apiService.updateEvent(id, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'user'] });
    },
  });

  // Deletar evento
  const deleteEventMutation = useMutation({
    mutationFn: (id: number) => apiService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'user'] });
    },
  });

  // Adicionar membro ao evento
  const addEventMemberMutation = useMutation({
    mutationFn: ({ eventId, userId }: { eventId: number; userId: number }) =>
      apiService.addEventMember(eventId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'user'] });
    },
  });

  // Remover membro do evento
  const removeEventMemberMutation = useMutation({
    mutationFn: ({ eventId, userId }: { eventId: number; userId: number }) =>
      apiService.removeEventMember(eventId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'user'] });
    },
  });

  return {
    // Dados
    events,
    academicEvents,
    partyEvents,
    
    // Estados de loading
    isLoading,
    isLoadingAcademic,
    isLoadingParty,
    
    // Erro
    error,
    
    // Funções
    refetch,
    createEvent,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    addEventMember: addEventMemberMutation.mutate,
    removeEventMember: removeEventMemberMutation.mutate,
    
    // Estados das mutações
    isCreating: createEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
    isAddingMember: addEventMemberMutation.isPending,
    isRemovingMember: removeEventMemberMutation.isPending,
    
    // Dados adicionais do usuário
    hasEvents,
    eventCount,
  };
};

export const useEvent = (id: number) => {

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['events', id],
    queryFn: () => apiService.getEventById(id),
    enabled: !!id,
  });

  return {
    event,
    isLoading,
    error,
  };
}; 