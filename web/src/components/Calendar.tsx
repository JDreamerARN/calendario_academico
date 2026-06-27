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
import { Add as AddIcon } from '@mui/icons-material';
import { format, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event } from '../types';
import { useEvents } from '../hooks/useEvents';
import LoadingSpinner from './LoadingSpinner';
import EventDetailsModal from './EventDetailsModal';
import { getEventDisplayColors, getTagColor } from '../utils/tagColors';

interface CalendarProps {
  onAddEvent?: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ onAddEvent }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tagFilter, setTagFilter] = useState<string>('TODOS');
  const [openModal, setOpenModal] = useState(false);

  const { events, isLoading, hasEvents, eventCount, error, refetch } = useEvents();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    events.forEach(event => {
      (event.tags || []).forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (tagFilter !== 'TODOS') {
      filtered = filtered.filter(event => (event.tags || []).includes(tagFilter));
    }
    
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    filtered = filtered.filter(event => {
      const eventDate = parseISO(event.date);
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });

    return filtered;
  }, [events, tagFilter, selectedDate]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEvent(null);
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
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>Meus Eventos</Typography>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>Erro ao carregar eventos</Typography>
          <Button variant="contained" onClick={() => refetch()} sx={{ borderRadius: 2 }}>
            Tentar Novamente
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!hasEvents) {
    return (
      <Box sx={{ p: isMobile ? 1 : 3, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>Meus Eventos</Typography>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Você ainda não tem eventos
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Crie seu primeiro evento clicando no botão "+" no canto inferior direito.
          </Typography>
          {onAddEvent && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAddEvent} sx={{ borderRadius: 2 }}>
              Criar Primeiro Evento
            </Button>
          )}
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Meus Eventos</Typography>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Filtrar por Tag</InputLabel>
            <Select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              label="Filtrar por Tag"
            >
              <MenuItem value="TODOS">Todas</MenuItem>
              {allTags.map(tag => (
                <MenuItem key={tag} value={tag}>{tag}</MenuItem>
              ))}
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

        {allTags.length > 0 && (
          <Box sx={{ mb: 2, p: 2, backgroundColor: theme.palette.grey[50], borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Tags nos seus eventos:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {allTags.map((tag) => {
                const colors = getTagColor(tag);
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onClick={() => setTagFilter(tagFilter === tag ? 'TODOS' : tag)}
                    sx={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: tagFilter === tag ? '2px solid' : 'none',
                      borderColor: colors.text,
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        )}
      </Box>

      <Paper elevation={2} sx={{ p: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
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
                '&:hover': day ? { backgroundColor: theme.palette.action.hover } : {},
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
                  
                  {getEventsForDay(day).map((event) => {
                    const colors = getEventDisplayColors(event.color);
                    return (
                      <Chip
                        key={event.id}
                        label={event.title}
                        size="small"
                        variant="filled"
                        sx={{
                          mb: 0.5,
                          fontSize: '0.7rem',
                          maxWidth: '100%',
                          backgroundColor: colors.bg,
                          color: colors.text,
                          fontWeight: 600,
                          '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
                          '&:hover': { backgroundColor: colors.bg, opacity: 0.85 },
                        }}
                        onClick={() => handleEventClick(event)}
                      />
                    );
                  })}
                </>
              )}
            </Box>
          ))}
        </Box>
      </Paper>

      <EventDetailsModal
        open={openModal}
        onClose={handleCloseModal}
        onEventUpdated={() => refetch()}
        onEventDeleted={() => refetch()}
        eventId={selectedEvent?.id ?? null}
      />

      {onAddEvent && (
        <Tooltip title="Adicionar Evento">
          <Fab
            color="primary"
            aria-label="add"
            onClick={onAddEvent}
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      )}
    </Box>
  );
};

export default Calendar;
