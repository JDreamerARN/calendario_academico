import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    registrationNumber: '',
    userType: 'ALUNO' as 'ALUNO' | 'PROFESSOR' | 'ADMINISTRADOR',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Email inválido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await apiService.register(registerData);
      setSuccess('Usuário registrado com sucesso! Aguarde aprovação do administrador.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar usuário.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: isMobile ? 3 : 4,
            width: '100%',
            maxWidth: 600,
            borderRadius: 2,
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography
                component="h1"
                variant={isMobile ? 'h5' : 'h4'}
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.primary.main,
                  mb: 1,
                }}
              >
                Cadastro de Usuário
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preencha os dados para criar sua conta
              </Typography>
            </Box>

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

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField
                label="Nome de usuário"
                value={formData.username}
                onChange={handleChange('username')}
                required
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                required
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                label="Telefone"
                value={formData.phone}
                onChange={handleChange('phone')}
                required
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                label="Número de matrícula"
                value={formData.registrationNumber}
                onChange={handleChange('registrationNumber')}
                required
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Tipo de usuário</InputLabel>
                  <Select
                    value={formData.userType}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      userType: e.target.value as 'ALUNO' | 'PROFESSOR' | 'ADMINISTRADOR',
                    }))}
                    label="Tipo de usuário"
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="ALUNO">Aluno</MenuItem>
                    <MenuItem value="PROFESSOR">Professor</MenuItem>
                    <MenuItem value="ADMINISTRADOR">Administrador</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <TextField
                label="Senha"
                type="password"
                value={formData.password}
                onChange={handleChange('password')}
                required
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                label="Confirmar senha"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                required
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
              }}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Já tem uma conta?{' '}
                <Link
                  href="/login"
                  variant="body2"
                  sx={{
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Faça login aqui
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 