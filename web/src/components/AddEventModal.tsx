import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import apiService from '../services/api';
import { CreateEventRequest, UserSummary } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getTagColor } from '../utils/tagColors';

interface AddEventModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (eventData: CreateEventRequest) => void;
  isLoading?: boolean;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    date: new Date(),
    memberIds: [] as number[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await apiService.getAllUsers();
      setUsers(response);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
      if (errors.date) {
        setErrors(prev => ({ ...prev, date: '' }));
      }
    }
  };

  const handleMemberChange = (_event: React.SyntheticEvent, newValue: UserSummary[]) => {
    const memberIds = newValue.map(u => u.id);
    setFormData(prev => ({ ...prev, memberIds }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const eventData: CreateEventRequest = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      tags: formData.tags,
      date: formData.date.toISOString(),
      memberIds: user?.id ? [...formData.memberIds, user.id] : formData.memberIds,
    };

    onSubmit(eventData);
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      tags: [],
      date: new Date(),
      memberIds: [],
    });
    setErrors({});
    onClose();
  };

  const getSelectedUsers = () => {
    return users.filter(u => formData.memberIds.includes(u.id));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Criar Novo Evento
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Título do Evento"
              value={formData.title}
              onChange={handleChange('title')}
              fullWidth
              required
              error={!!errors.title}
              helperText={errors.title}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              label="Descrição"
              value={formData.description}
              onChange={handleChange('description')}
              fullWidth
              required
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formData.tags}
              onChange={(_event, newValue) => {
                setFormData(prev => ({
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
                <TextField
                  {...params}
                  label="Tags"
                  placeholder="Digite e pressione Enter..."
                  variant="outlined"
                  helperText="Adicione tags livres para organizar o evento"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              )}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DateTimePicker
                label="Data e Hora do Evento"
                value={formData.date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.date,
                    helperText: errors.date,
                    variant: 'outlined',
                    sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } },
                  },
                }}
              />
            </LocalizationProvider>

            <Autocomplete
              multiple
              options={users.filter(u => u.id !== user?.id)}
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
                  label="Adicionar Membros (Opcional)"
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingUsers ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.id}
                    label={option.username}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))
              }
              noOptionsText="Nenhum usuário encontrado"
              loadingText="Carregando usuários..."
            />

            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Dica:</strong> Você será automaticamente adicionado como organizador do evento.
                {formData.memberIds.length > 0 && (
                  <span> {formData.memberIds.length} membro(s) selecionado(s).</span>
                )}
              </Typography>
            </Alert>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose} variant="outlined" disabled={isLoading} sx={{ borderRadius: 2, px: 3 }}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading} sx={{ borderRadius: 2, px: 3 }}>
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Criando...
              </>
            ) : (
              'Criar Evento'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddEventModal;
