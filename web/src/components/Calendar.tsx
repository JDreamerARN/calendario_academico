import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Celebration as CelebrationIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  Group as GroupIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { format, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event } from '../types';
import { useEvents } from '../hooks/useEvents';
import LoadingSpinner from './LoadingSpinner';
import EventDetailsModal from './EventDetailsModal';


interface CalendarProps {
  onAddEvent?: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ onAddEvent }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('TODOS');
  const [openModal, setOpenModal] = useState(false);

  const { events, isLoading, hasEvents, eventCount, error, refetch } = useEvents();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));



  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (eventTypeFilter !== 'TODOS') {
      filtered = filtered.filter(event => event.eventType === eventTypeFilter);
    }
    
    // Filtrar por mês/ano selecionado
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    filtered = filtered.filter(event => {
      const eventDate = parseISO(event.date);
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });

    return filtered;
  }, [events, eventTypeFilter, selectedDate]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEvent(null);
  };

  const handleEventUpdated = () => {
    refetch();
  };

  const handleEventDeleted = () => {
    refetch();
  };

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

  const getEventBackgroundColor = (eventType: string) => {
    switch (eventType) {
      case 'PROVA':
        return '#ffebee'; // Vermelho claro
      case 'TRABALHO':
        return '#fff3e0'; // Laranja claro
      case 'FESTA':
        return '#f3e5f5'; // Roxo claro
      case 'REUNIAO':
        return '#e3f2fd'; // Azul claro
      case 'OUTRO':
        return '#f5f5f5'; // Cinza claro
      default:
        return '#e8f5e8'; // Verde claro padrão
    }
  };

  const getEventTextColor = (eventType: string) => {
    switch (eventType) {
      case 'PROVA':
        return '#b71c1c'; // Vermelho escuro
      case 'TRABALHO':
        return '#e65100'; // Laranja escuro
      case 'FESTA':
        return '#6a1b9a'; // Roxo escuro
      case 'REUNIAO':
        return '#01579b'; // Azul escuro
      case 'OUTRO':
        return '#333'; // Cinza escuro
      default:
        return '#222';
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => isSameDay(parseISO(event.date), day));
  };

  const days = getDaysInMonth(selectedDate);
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  if (isLoading) {
    return <LoadingSpinner message="Carregando seus eventos..." />;
  }

  if (error) {
    return (
      <Box sx={{ p: isMobile ? 1 : 3, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Meus Eventos
        </Typography>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Erro ao carregar eventos
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Não foi possível carregar seus eventos. Tente novamente.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ borderRadius: 2 }}
          >
            Tentar Novamente
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!hasEvents) {
    return (
      <Box sx={{ p: isMobile ? 1 : 3, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Meus Eventos
        </Typography>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Você ainda não tem eventos
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Crie seu primeiro evento clicando no botão "+" no canto inferior direito.
          </Typography>
          {onAddEvent && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddEvent}
              sx={{ borderRadius: 2 }}
            >
              Criar Primeiro Evento
            </Button>
          )}
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* Header e Filtros */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Meus Eventos
          </Typography>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Tipo de Evento</InputLabel>
            <Select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              label="Tipo de Evento"
            >
              <MenuItem value="TODOS">Todos</MenuItem>
              <MenuItem value="PROVA">Prova</MenuItem>
              <MenuItem value="TRABALHO">Trabalho</MenuItem>
              <MenuItem value="FESTA">Festa</MenuItem>
              <MenuItem value="REUNIAO">Reunião</MenuItem>
              <MenuItem value="OUTRO">Outro</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            onClick={() => {
              const prevMonth = new Date(selectedDate);
              prevMonth.setMonth(prevMonth.getMonth() - 1);
              setSelectedDate(prevMonth);
            }}
            fullWidth
          >
            Mês Anterior
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              const nextMonth = new Date(selectedDate);
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              setSelectedDate(nextMonth);
            }}
            fullWidth
          >
            Próximo Mês
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
          </Typography>
          <Chip
            label={`${eventCount} evento${eventCount !== 1 ? 's' : ''}`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Legenda dos tipos de eventos */}
        <Box sx={{ mb: 2, p: 2, backgroundColor: theme.palette.grey[50], borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#222' }}>
            Legenda dos Tipos de Eventos:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip
              icon={<QuizIcon sx={{ color: 'white' }} />}
              label={<span style={{ color: '#b71c1c', fontWeight: 600 }}>Prova</span>}
              size="small"
              variant="filled"
              sx={{ backgroundColor: getEventBackgroundColor('PROVA'), color: '#b71c1c', fontWeight: 600 }}
            />
            <Chip
              icon={<AssignmentIcon sx={{ color: 'white' }} />}
              label={<span style={{ color: '#e65100', fontWeight: 600 }}>Trabalho</span>}
              size="small"
              variant="filled"
              sx={{ backgroundColor: getEventBackgroundColor('TRABALHO'), color: '#e65100', fontWeight: 600 }}
            />
            <Chip
              icon={<CelebrationIcon sx={{ color: 'white' }} />}
              label={<span style={{ color: '#6a1b9a', fontWeight: 600 }}>Festa</span>}
              size="small"
              variant="filled"
              sx={{ backgroundColor: getEventBackgroundColor('FESTA'), color: '#6a1b9a', fontWeight: 600 }}
            />
            <Chip
              icon={<GroupIcon sx={{ color: 'white' }} />}
              label={<span style={{ color: '#01579b', fontWeight: 600 }}>Reunião</span>}
              size="small"
              variant="filled"
              sx={{ backgroundColor: getEventBackgroundColor('REUNIAO'), color: '#01579b', fontWeight: 600 }}
            />
            <Chip
              icon={<EventIcon sx={{ color: 'white' }} />}
              label={<span style={{ color: '#333', fontWeight: 600 }}>Outro</span>}
              size="small"
              variant="filled"
              sx={{ backgroundColor: getEventBackgroundColor('OUTRO'), color: '#333', fontWeight: 600 }}
            />
          </Box>
        </Box>
      </Box>

      {/* Calendário */}
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          {/* Cabeçalho dos dias da semana */}
          {weekDays.map((day) => (
            <Box
              key={day}
              sx={{
                p: 1,
                textAlign: 'center',
                fontWeight: 'bold',
                backgroundColor: theme.palette.grey[100],
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">{day}</Typography>
            </Box>
          ))}

          {/* Dias do mês */}
          {days.map((day, index) => (
            <Box
              key={index}
              sx={{
                minHeight: isMobile ? 80 : 120,
                p: 1,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                backgroundColor: day ? 'background.paper' : 'transparent',
                cursor: day ? 'pointer' : 'default',
                '&:hover': day ? {
                  backgroundColor: theme.palette.action.hover,
                } : {},
              }}
            >
              {day && (
                <>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      color: isSameDay(day, new Date()) ? 'primary.main' : 'text.primary',
                    }}
                  >
                    {day.getDate()}
                  </Typography>
                  
                  {/* Eventos do dia */}
                  {getEventsForDay(day).map((event) => (
                    <Chip
                      key={event.id}
                      icon={getEventIcon(event.eventType)}
                      label={event.title}
                      size="small"
                      variant="filled"
                      sx={{
                        mb: 0.5,
                        fontSize: '0.7rem',
                        maxWidth: '100%',
                        backgroundColor: getEventBackgroundColor(event.eventType),
                        color: getEventTextColor(event.eventType),
                        fontWeight: 600,
                        '& .MuiChip-label': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        },
                        '&:hover': {
                          backgroundColor: getEventBackgroundColor(event.eventType),
                          opacity: 0.85,
                        },
                      }}
                      onClick={() => handleEventClick(event)}
                    />
                  ))}
                </>
              )}
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Modal de Detalhes do Evento */}
      <EventDetailsModal
        open={openModal}
        onClose={handleCloseModal}
        onEventUpdated={handleEventUpdated}
        onEventDeleted={handleEventDeleted}
        eventId={selectedEvent?.id ?? null}
      />

      {/* Botão Flutuante para Adicionar Evento */}
      {onAddEvent && (
        <Tooltip title="Adicionar Evento">
          <Fab
            color="primary"
            aria-label="add"
            onClick={onAddEvent}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      )}
    </Box>
  );
};

export default Calendar; 