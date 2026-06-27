import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';
import { CreateEventRequest, UpdateEventRequest } from '../types';
import { useUserEvents } from './useUserEvents';

export const useEvents = () => {
  const queryClient = useQueryClient();
  const { events, isLoading, error, refetch, hasEvents, eventCount } = useUserEvents();

  const createEventMutation = useMutation({
    mutationFn: (eventData: CreateEventRequest) => apiService.createEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'user'] });
    },
  });

  const createEvent = (
    eventData: CreateEventRequest,
    callbacks?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }
  ) => {
    createEventMutation.mutate(eventData, {
      onSuccess: () => {
        callbacks?.onSuccess?.();
      },
      onError: (error) => {
        callbacks?.onError?.(error as Error);
      },
    });
  };

  const updateEventMutation = useMutation({
    mutationFn: ({ id, eventData }: { id: number; eventData: UpdateEventRequest }) =>
      apiService.updateEvent(id, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'user'] });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: number) => apiService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'user'] });
    },
  });

  const addEventMemberMutation = useMutation({
    mutationFn: ({ eventId, userId }: { eventId: number; userId: number }) =>
      apiService.addEventMember(eventId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'user'] });
    },
  });

  const removeEventMemberMutation = useMutation({
    mutationFn: ({ eventId, userId }: { eventId: number; userId: number }) =>
      apiService.removeEventMember(eventId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'user'] });
    },
  });

  return {
    events,
    isLoading,
    error,
    refetch,
    createEvent,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    addEventMember: addEventMemberMutation.mutate,
    removeEventMember: removeEventMemberMutation.mutate,
    isCreating: createEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
    isAddingMember: addEventMemberMutation.isPending,
    isRemovingMember: removeEventMemberMutation.isPending,
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
