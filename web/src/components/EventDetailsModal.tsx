import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Autocomplete,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  Celebration as CelebrationIcon,
  Group as GroupIcon,
  Event as EventIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import { UpdateEventRequest, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { useEvent } from '../hooks/useEvents';

interface EventDetailsModalProps {
  open: boolean;
  onClose: () => void;
  eventId: number | null;
  onEventUpdated?: () => void;
  onEventDeleted?: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  open,
  onClose,
  eventId,
  onEventUpdated,
  onEventDeleted,
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  
  const [editData, setEditData] = useState<UpdateEventRequest>({
    title: '',
    description: '',
    eventType: 'PROVA',
    date: '',
  });

  // Buscar evento pelo ID
  const { event: eventFromHook, isLoading: isLoadingEvent, error: errorEvent } = useEvent(eventId ?? 0);
  const [localEvent, setLocalEvent] = useState(eventFromHook);
  
  // Atualizar evento local quando o hook retornar dados
  React.useEffect(() => {
    if (eventFromHook) {
      setLocalEvent(eventFromHook);
    }
  }, [eventFromHook]);
  
  // Usar evento local como fonte de dados
  const event = localEvent;

  // Função para recarregar os dados do evento
  const reloadEvent = React.useCallback(async () => {
    if (!eventId) return;
    
    try {
      const updatedEvent = await apiService.getEventById(eventId);
      setLocalEvent(updatedEvent);
      // Atualizar dados de edição e membros
      setEditData({
        title: updatedEvent.title,
        description: updatedEvent.description,
        eventType: updatedEvent.eventType,
        date: updatedEvent.date,
      });
      const memberIds = updatedEvent.members.map((member: import('../types').EventMember) => member.user.id);
      setSelectedMemberIds(memberIds);
    } catch (e) {
      // Se der erro, não faz nada
    }
  }, [eventId]);

  // Buscar usuários quando o modal abrir
  React.useEffect(() => {
    if (open) {
      fetchUsers();
      // Recarregar evento quando modal abrir
      if (eventId) {
        reloadEvent();
      }
    }
  }, [open, eventId, reloadEvent]);

  // Função para buscar usuários
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      console.log('🚀 Buscando usuários para edição...');
      const usersData = await apiService.getAllUsers();
      console.log('✅ Usuários carregados:', usersData);
      setUsers(usersData);
    } catch (error) {
      console.error('❌ Erro ao buscar usuários:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Inicializar dados de edição quando o evento mudar
  React.useEffect(() => {
    if (event) {
      setEditData({
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        date: event.date,
      });
      // Inicializar membros selecionados
      const memberIds = event.members.map(member => member.user.id);
      setSelectedMemberIds(memberIds);
    }
  }, [event]);

  const isOrganizer = event && user?.id === event.organizer.id;

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'PROVA':
        return <QuizIcon />;
      case 'TRABALHO':
        return <AssignmentIcon />;
      case 'FESTA':
        return <CelebrationIcon />;
      case 'REUNIAO':
        return <GroupIcon />;
      case 'OUTRO':
        return <EventIcon />;
      default:
        return <EventIcon />;
    }
  };

  const getEventTypeLabel = (eventType: string) => {
    switch (eventType) {
      case 'PROVA':
        return 'Prova';
      case 'TRABALHO':
        return 'Trabalho';
      case 'FESTA':
        return 'Festa';
      case 'REUNIAO':
        return 'Reunião';
      case 'OUTRO':
        return 'Outro';
      default:
        return eventType;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    // Restaurar dados originais
    if (event) {
      setEditData({
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        date: event.date,
      });
      // Restaurar membros originais
      const memberIds = event.members.map(member => member.user.id);
      setSelectedMemberIds(memberIds);
    }
  };

  const handleSave = async () => {
    if (!event) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Primeiro, atualizar dados básicos do evento
      await apiService.updateEvent(event.id, editData);
      
      // Depois, atualizar membros
      const currentMemberIds = event.members.map(member => member.user.id);
      const newMemberIds = selectedMemberIds;
      
      // Remover membros que não estão mais selecionados
      const membersToRemove = currentMemberIds.filter(id => !newMemberIds.includes(id));
      for (const memberId of membersToRemove) {
        await apiService.removeEventMember(event.id, memberId);
      }
      
      // Adicionar novos membros
      const membersToAdd = newMemberIds.filter(id => !currentMemberIds.includes(id));
      for (const memberId of membersToAdd) {
        await apiService.addEventMember(event.id, memberId);
      }
      
      // SÓ APÓS TODAS AS OPERAÇÕES TEREM SUCESSO, atualizar o estado local
      // Recarregar os dados do evento do backend para garantir sincronização
      await reloadEvent();
      
      // Notificar componente pai, se necessário
      if (onEventUpdated) onEventUpdated();

      setSuccess('Evento atualizado com sucesso!');
      setIsEditing(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar evento';
      setError(errorMessage);
      // Em caso de erro, NÃO atualizar o estado local
    } finally {
      setIsLoading(false);
    }
  };



  const handleDelete = async () => {
    if (!event) return;

    if (!window.confirm('Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await apiService.deleteEvent(event.id);
      setSuccess('Evento excluído com sucesso!');
      onEventDeleted?.();
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir evento';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    onClose();
  };

  // Função para gerenciar mudanças nos membros selecionados
  const handleMemberChange = (event: React.SyntheticEvent, newValue: User[]) => {
    const memberIds = newValue.map(user => user.id);
    setSelectedMemberIds(memberIds);
  };

  // Função para obter usuários selecionados
  const getSelectedUsers = () => {
    return users.filter(user => selectedMemberIds.includes(user.id));
  };

  if (!open) return null;

  if (isLoadingEvent) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Carregando evento...</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (errorEvent || !event) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Erro ao carregar evento</DialogTitle>
        <DialogContent>
          <Alert severity="error">{errorEvent ? String(errorEvent) : 'Evento não encontrado.'}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getEventIcon(event.eventType)}
            <Typography variant="h6">
              {isEditing ? 'Editar Evento' : event.title}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} disabled={isLoading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Título */}
          {isEditing ? (
            <TextField
              label="Título do Evento"
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          ) : (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Título
              </Typography>
              <Typography variant="h6">{event.title}</Typography>
            </Box>
          )}

          {/* Descrição */}
          {isEditing ? (
            <TextField
              label="Descrição"
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
              required
              multiline
              rows={4}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          ) : (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Descrição
              </Typography>
              <Typography variant="body1">{event.description}</Typography>
            </Box>
          )}

          {/* Tipo de Evento */}
          {isEditing ? (
            <FormControl fullWidth variant="outlined">
              <InputLabel>Tipo de Evento</InputLabel>
              <Select
                value={editData.eventType}
                onChange={(e) => setEditData(prev => ({ ...prev, eventType: e.target.value as 'PROVA' | 'TRABALHO' | 'FESTA' | 'REUNIAO' | 'OUTRO' }))}
                label="Tipo de Evento"
                sx={{
                  borderRadius: 2,
                }}
              >
                <MenuItem value="PROVA">Prova</MenuItem>
                <MenuItem value="TRABALHO">Trabalho</MenuItem>
                <MenuItem value="FESTA">Festa</MenuItem>
                <MenuItem value="REUNIAO">Reunião</MenuItem>
                <MenuItem value="OUTRO">Outro</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Tipo do Evento
              </Typography>
              <Chip
                icon={getEventIcon(event.eventType)}
                label={getEventTypeLabel(event.eventType)}
                size="small"
                variant="outlined"
              />
            </Box>
          )}

          {/* Data do Evento */}
          {isEditing ? (
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DateTimePicker
                label="Data e Hora do Evento"
                value={new Date(editData.date)}
                onChange={(date) => {
                  if (date) {
                    setEditData(prev => ({ ...prev, date: date.toISOString() }));
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          ) : (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Data do Evento
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon color="action" />
                <Typography variant="body1">
                  {format(parseISO(event.date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Seleção de Membros (apenas na edição) */}
          {isEditing && (
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) => `${option.username} (${option.email})`}
              value={getSelectedUsers()}
              onChange={handleMemberChange}
              loading={isLoadingUsers}
              filterOptions={(options, { inputValue }) => {
                const searchTerm = inputValue.toLowerCase();
                return options.filter(
                  (option) =>
                    option.username.toLowerCase().includes(searchTerm) ||
                    option.email.toLowerCase().includes(searchTerm)
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Participantes"
                  placeholder="Selecione os participantes..."
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.id}
                    label={`${option.username} (${option.email})`}
                    size="small"
                    variant="outlined"
                  />
                ))
              }
            />
          )}

          <Divider />

          {/* Organizador */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Organizador
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon color="action" />
              <Typography variant="body1">{event.organizer.username}</Typography>
            </Box>
          </Box>

          {/* Membros */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Participantes ({event.members.length})
            </Typography>
            {event.members.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {event.members.map((member) => (
                  <Chip
                    key={member.id}
                    label={member.user && member.user.username ? member.user.username : 'Participante'}
                    size="small"
                    variant="outlined"
                    icon={<PersonIcon />}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhum participante ainda.
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        {isOrganizer && !isEditing && (
          <>
            <Button
              onClick={handleEdit}
              variant="outlined"
              startIcon={<EditIcon />}
              disabled={isLoading}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Editar
            </Button>
            <Button
              onClick={handleDelete}
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              disabled={isLoading}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Excluir
            </Button>
          </>
        )}

        {isEditing && (
          <>
            <Button
              onClick={handleCancelEdit}
              variant="outlined"
              startIcon={<CancelIcon />}
              disabled={isLoading}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={isLoading}
              sx={{ borderRadius: 2, px: 3 }}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </>
        )}

        {!isEditing && (
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Fechar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailsModal; 