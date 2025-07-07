import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  SelectChangeEvent,
  Alert,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import apiService from '../services/api';
import { CreateEventRequest, User, EventType } from '../types';
import { useAuth } from '../contexts/AuthContext';

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
    eventType: '',
    date: new Date(),
    memberIds: [] as number[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Buscar usuários quando o modal abrir
  const fetchUsers = async () => {
    try {
      console.log('🚀 Buscando usuários...');
      setIsLoadingUsers(true);
      const response = await apiService.getAllUsers();
      console.log('✅ Usuários carregados:', response);
      setUsers(response);
    } catch (error) {
      console.error('❌ Erro ao buscar usuários:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  React.useEffect(() => {
    console.log('🔍 useEffect executado - open:', open);
    if (open) {
      console.log('🚀 Modal aberto, buscando usuários...');
      fetchUsers();
    }
  }, [open]);

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEventTypeChange = (event: SelectChangeEvent) => {
    console.log('🎯 handleEventTypeChange chamado');
    console.log('🎯 Valor selecionado:', event.target.value);
    console.log('🎯 Tipo do valor:', typeof event.target.value);
    
    setFormData(prev => {
      const newData = {
        ...prev,
        eventType: event.target.value,
      };
      console.log('🎯 Novo formData:', newData);
      return newData;
    });
    
    if (errors.eventType) {
      setErrors(prev => ({ ...prev, eventType: '' }));
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

  const handleMemberChange = (event: React.SyntheticEvent, newValue: User[]) => {
    const memberIds = newValue.map(user => user.id);
    setFormData(prev => ({
      ...prev,
      memberIds,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validações básicas
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    // Validação do tipo de evento
    if (!formData.eventType || formData.eventType === '') {
      newErrors.eventType = 'Tipo de evento é obrigatório';
    }

    // Remover validação de data temporariamente para debug
    // if (formData.date <= new Date()) {
    //   newErrors.date = 'A data deve ser no futuro';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const eventData: CreateEventRequest = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      eventType: formData.eventType as EventType,
      date: formData.date.toISOString(),
      memberIds: user?.id ? [...formData.memberIds, user.id] : formData.memberIds,
    };

    console.log('🎯 Dados do evento sendo enviados:', eventData);
    console.log('👤 Usuário logado:', user);
    console.log('📅 Data formatada:', formData.date.toISOString());
    console.log('🔢 Member IDs:', eventData.memberIds);

    onSubmit(eventData);
  };

  const handleClose = () => {
    // Resetar formulário ao fechar
    setFormData({
      title: '',
      description: '',
      eventType: '',
      date: new Date(),
      memberIds: [],
    });
    setErrors({});
    onClose();
  };

  const getSelectedUsers = () => {
    console.log('👥 getSelectedUsers - total de usuários:', users.length);
    console.log('👥 Usuários disponíveis:', users);
    return users.filter(user => formData.memberIds.includes(user.id));
  };

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
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Criar Novo Evento
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Título */}
            <TextField
              label="Título do Evento"
              value={formData.title}
              onChange={handleChange('title')}
              fullWidth
              required
              error={!!errors.title}
              helperText={errors.title}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Descrição */}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Tipo de Evento */}
            <FormControl fullWidth variant="outlined" error={!!errors.eventType}>
              <InputLabel>Tipo de Evento</InputLabel>
              <Select
                value={formData.eventType}
                onChange={handleEventTypeChange}
                label="Tipo de Evento"
                sx={{
                  borderRadius: 2,
                }}
              >
                <MenuItem value="" disabled>
                  Selecione o tipo do evento...
                </MenuItem>
                {user?.userType === 'ADMINISTRADOR' && [
                  <MenuItem value="PROVA" key="PROVA">Prova</MenuItem>,
                  <MenuItem value="FESTA" key="FESTA">Festa</MenuItem>,
                  <MenuItem value="REUNIAO" key="REUNIAO">Reunião</MenuItem>,
                  <MenuItem value="TRABALHO" key="TRABALHO">Trabalho</MenuItem>,
                  <MenuItem value="OUTRO" key="OUTRO">Outro</MenuItem>
                ]}
                {user?.userType === 'PROFESSOR' && [
                  <MenuItem value="PROVA" key="PROVA">Prova</MenuItem>,
                  <MenuItem value="REUNIAO" key="REUNIAO">Reunião</MenuItem>,
                  <MenuItem value="TRABALHO" key="TRABALHO">Trabalho</MenuItem>,
                  <MenuItem value="OUTRO" key="OUTRO">Outro</MenuItem>
                ]}
                {user?.userType === 'ALUNO' && [
                  <MenuItem value="FESTA" key="FESTA">Festa</MenuItem>,
                  <MenuItem value="REUNIAO" key="REUNIAO">Reunião</MenuItem>,
                  <MenuItem value="OUTRO" key="OUTRO">Outro</MenuItem>
                ]}
              </Select>
              {errors.eventType && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {errors.eventType}
                </Typography>
              )}
            </FormControl>

            {/* Data e Hora */}
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
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>

            {/* Seleção de Membros */}
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
                  label="Adicionar Membros (Opcional)"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
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
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {option.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.email}
                    </Typography>
                  </Box>
                </Box>
              )}
              noOptionsText="Nenhum usuário encontrado"
              loadingText="Carregando usuários..."
            />

            {/* Informações adicionais */}
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
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={isLoading}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ borderRadius: 2, px: 3 }}
          >
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