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
  Alert,
  CircularProgress,
  Divider,
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import { UpdateEventRequest, UserSummary, Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { useEvent } from '../hooks/useEvents';
import { getTagColor } from '../utils/tagColors';

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
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  const [editData, setEditData] = useState<UpdateEventRequest>({
    title: '',
    description: '',
    tags: [],
    date: '',
  });

  const { event: eventFromHook, isLoading: isLoadingEvent, error: errorEvent } = useEvent(eventId ?? 0);
  const [localEvent, setLocalEvent] = useState(eventFromHook);
  
  React.useEffect(() => {
    if (eventFromHook) {
      setLocalEvent(eventFromHook);
      if (eventFromHook.comments) {
        setComments(eventFromHook.comments);
      }
    }
  }, [eventFromHook]);
  
  const event = localEvent;

  const reloadEvent = React.useCallback(async () => {
    if (!eventId) return;
    
    try {
      const updatedEvent = await apiService.getEventById(eventId);
      setLocalEvent(updatedEvent);
      setEditData({
        title: updatedEvent.title,
        description: updatedEvent.description,
        tags: updatedEvent.tags || [],
        date: updatedEvent.date,
      });
      const memberIds = updatedEvent.members.map((member) => member.user.id);
      setSelectedMemberIds(memberIds);
      if (updatedEvent.comments) {
        setComments(updatedEvent.comments);
      } else {
        const fetchedComments = await apiService.getComments(eventId);
        setComments(fetchedComments);
      }
    } catch {
      // ignore
    }
  }, [eventId]);

  React.useEffect(() => {
    if (open && eventId) {
      fetchUsers();
      reloadEvent();
    }
  }, [open, eventId, reloadEvent]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const usersData = await apiService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  React.useEffect(() => {
    if (event) {
      setEditData({
        title: event.title,
        description: event.description,
        tags: event.tags || [],
        date: event.date,
      });
      const memberIds = event.members.map(member => member.user.id);
      setSelectedMemberIds(memberIds);
    }
  }, [event]);

  const isOrganizer = event && user?.id === event.organizer.id;

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    if (event) {
      setEditData({
        title: event.title,
        description: event.description,
        tags: event.tags || [],
        date: event.date,
      });
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
      await apiService.updateEvent(event.id, editData);
      
      const currentMemberIds = event.members.map(member => member.user.id);
      const newMemberIds = selectedMemberIds;
      
      const membersToRemove = currentMemberIds.filter(id => !newMemberIds.includes(id));
      for (const memberId of membersToRemove) {
        await apiService.removeEventMember(event.id, memberId);
      }
      
      const membersToAdd = newMemberIds.filter(id => !currentMemberIds.includes(id));
      for (const memberId of membersToAdd) {
        await apiService.addEventMember(event.id, memberId);
      }
      
      await reloadEvent();
      onEventUpdated?.();
      setSuccess('Evento atualizado com sucesso!');
      setIsEditing(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar evento';
      setError(errorMessage);
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
      onEventDeleted?.();
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir evento';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!event || !newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const comment = await apiService.addComment(event.id, { content: newComment.trim() });
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } catch {
      setError('Erro ao adicionar comentário');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!event) return;
    try {
      await apiService.deleteComment(event.id, commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch {
      setError('Erro ao excluir comentário');
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    setNewComment('');
    onClose();
  };

  const handleMemberChange = (_event: React.SyntheticEvent, newValue: UserSummary[]) => {
    setSelectedMemberIds(newValue.map(u => u.id));
  };

  const getSelectedUsers = () => {
    return users.filter(u => selectedMemberIds.includes(u.id));
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
          <Alert severity="error">{errorEvent ? String(errorEvent) : 'Evento não encontrado ou sem permissão.'}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {isEditing ? 'Editar Evento' : event.title}
          </Typography>
          <IconButton onClick={handleClose} disabled={isLoading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {isEditing ? (
            <TextField
              label="Título do Evento"
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              fullWidth required variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          ) : (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>Título</Typography>
              <Typography variant="h6">{event.title}</Typography>
            </Box>
          )}

          {isEditing ? (
            <TextField
              label="Descrição"
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              fullWidth required multiline rows={4} variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          ) : (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>Descrição</Typography>
              <Typography variant="body1">{event.description}</Typography>
            </Box>
          )}

          {isEditing ? (
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={editData.tags}
              onChange={(_event, newValue) => {
                setEditData(prev => ({
                  ...prev,
                  tags: newValue.map(v => (typeof v === 'string' ? v.trim() : v)).filter(Boolean) as string[],
                }));
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const colors = getTagColor(option);
                  return (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                      sx={{ backgroundColor: colors.bg, color: colors.text }}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField {...params} label="Tags" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              )}
            />
          ) : (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>Tags</Typography>
              {event.tags && event.tags.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {event.tags.map((tag) => {
                    const colors = getTagColor(tag);
                    return (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{ backgroundColor: colors.bg, color: colors.text }}
                      />
                    );
                  })}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">Nenhuma tag</Typography>
              )}
            </Box>
          )}

          {isEditing ? (
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DateTimePicker
                label="Data e Hora do Evento"
                value={new Date(editData.date)}
                onChange={(date) => {
                  if (date) setEditData(prev => ({ ...prev, date: date.toISOString() }));
                }}
                slotProps={{
                  textField: {
                    fullWidth: true, variant: 'outlined',
                    sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } },
                  },
                }}
              />
            </LocalizationProvider>
          ) : (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>Data do Evento</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon color="action" />
                <Typography variant="body1">
                  {format(parseISO(event.date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </Typography>
              </Box>
            </Box>
          )}

          {isEditing && (
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) => `${option.username} (${option.email})`}
              value={getSelectedUsers()}
              onChange={handleMemberChange}
              loading={isLoadingUsers}
              renderInput={(params) => (
                <TextField {...params} label="Participantes" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip {...getTagProps({ index })} key={option.id} label={option.username} size="small" variant="outlined" />
                ))
              }
            />
          )}

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>Organizador</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon color="action" />
              <Typography variant="body1">{event.organizer.username}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Participantes ({event.members.length})
            </Typography>
            {event.members.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {event.members.map((member) => (
                  <Chip
                    key={member.id}
                    label={member.user?.username || 'Participante'}
                    size="small"
                    variant="outlined"
                    icon={<PersonIcon />}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">Nenhum participante ainda.</Typography>
            )}
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Comentários ({comments.length})
            </Typography>
            <List dense>
              {comments.map((comment) => (
                <ListItem key={comment.id} alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">{comment.author.username}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(parseISO(comment.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </Typography>
                      </Box>
                    }
                    secondary={comment.content}
                  />
                  {user?.id === comment.author.id && (
                    <ListItemSecondaryAction>
                      <IconButton edge="end" size="small" onClick={() => handleDeleteComment(comment.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Adicionar comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <IconButton
                color="primary"
                onClick={handleAddComment}
                disabled={isSubmittingComment || !newComment.trim()}
              >
                {isSubmittingComment ? <CircularProgress size={20} /> : <SendIcon />}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        {isOrganizer && !isEditing && (
          <>
            <Button onClick={handleEdit} variant="outlined" startIcon={<EditIcon />} disabled={isLoading} sx={{ borderRadius: 2, px: 3 }}>
              Editar
            </Button>
            <Button onClick={handleDelete} variant="outlined" color="error" startIcon={<DeleteIcon />} disabled={isLoading} sx={{ borderRadius: 2, px: 3 }}>
              Excluir
            </Button>
          </>
        )}

        {isEditing && (
          <>
            <Button onClick={handleCancelEdit} variant="outlined" startIcon={<CancelIcon />} disabled={isLoading} sx={{ borderRadius: 2, px: 3 }}>
              Cancelar
            </Button>
            <Button onClick={handleSave} variant="contained" startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />} disabled={isLoading} sx={{ borderRadius: 2, px: 3 }}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </>
        )}

        {!isEditing && (
          <Button onClick={handleClose} variant="contained" sx={{ borderRadius: 2, px: 3 }}>
            Fechar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailsModal;
