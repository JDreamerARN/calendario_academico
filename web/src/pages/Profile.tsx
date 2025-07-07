import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  ListItemButton,
  ListItemIcon,
  Button,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  if (!user) {
    return <Typography>Carregando dados do usuário...</Typography>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Calendário', icon: <CalendarIcon />, action: () => { setDrawerOpen(false); navigate('/calendar'); } },
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
            Perfil do Usuário
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
      <Box sx={{ flexGrow: 1, backgroundColor: theme.palette.grey[50], p: 3 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              Perfil do Usuário
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem>
                <ListItemText primary="ID" secondary={user.id} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Nome de usuário" secondary={user.username} />
              </ListItem>
              <ListItem>
                <ListItemText primary="E-mail" secondary={user.email} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Telefone" secondary={user.phone} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Senha (hash)" secondary={user.password} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Matrícula" secondary={user.registrationNumber} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Tipo de usuário" secondary={user.userType} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Aprovado" secondary={user.approved ? 'Sim' : 'Não'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Criado em" secondary={user.createdAt} />
              </ListItem>
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Eventos que participa</Typography>
            {user.eventMemberships && user.eventMemberships.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {user.eventMemberships.map((ev: import('../types').EventMember) => (
                  <Chip key={ev.id} label={ev.event?.title || 'Evento'} />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Nenhuma participação em eventos.
              </Typography>
            )}
            <Typography variant="h6" sx={{ mb: 1 }}>Eventos criados</Typography>
            {user.createdEvents && user.createdEvents.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {user.createdEvents.map((ev: import('../types').Event) => (
                  <Chip key={ev.id} label={ev.title} color="primary" />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhum evento criado.
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile; 