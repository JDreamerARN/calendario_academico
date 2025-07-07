import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../hooks/useEvents';
import Calendar from '../components/Calendar';
import AddEventModal from '../components/AddEventModal';
import { CreateEventRequest } from '../types';

const CalendarPage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { createEvent, isCreating } = useEvents();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddEvent = () => {
    setModalOpen(true);
  };

  const handleCreateEvent = (eventData: CreateEventRequest) => {
    createEvent(eventData, {
      onSuccess: () => {
        setModalOpen(false);
        setSnackbar({
          open: true,
          message: 'Evento criado com sucesso!',
          severity: 'success',
        });
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: error.message || 'Erro ao criar evento. Tente novamente.',
          severity: 'error',
        });
      },
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const menuItems = [
    { text: 'Calendário', icon: <CalendarIcon />, action: () => { setDrawerOpen(false); navigate('/calendar'); } },
    ...(user?.userType === 'ADMINISTRADOR' ? [
      { text: 'Usuários', icon: <PersonIcon />, action: () => { setDrawerOpen(false); navigate('/users'); } },
    ] : []),
    { text: 'Perfil', icon: <PersonIcon />, action: () => { setDrawerOpen(false); navigate('/profile'); } },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Sistema de Eventos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.username}
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={item.action}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
        <ListItemButton
          onClick={handleLogout}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.error.light,
              color: theme.palette.error.contrastText,
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Calendário Acadêmico
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Olá, {user?.username}
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{
          keepMounted: true, // Melhora performance em mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Conteúdo Principal */}
      <Box sx={{ flexGrow: 1, backgroundColor: theme.palette.grey[50] }}>
        <Box sx={{ p: 3 }}>
        </Box>
        <Calendar onAddEvent={handleAddEvent} />
      </Box>

      {/* Modal de Adicionar Evento */}
      <AddEventModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateEvent}
        isLoading={isCreating}
      />

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CalendarPage; 