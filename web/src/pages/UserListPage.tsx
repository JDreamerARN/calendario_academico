import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { User } from '../types';

const UserListPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getAllUsers();
      setUsers(data);
    } catch (e) {
      setError('Erro ao buscar usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userType === 'ADMINISTRADOR') {
      fetchUsers();
    }
  }, [user]);

  const handleApprove = async (id: number) => {
    setApprovingId(id);
    setError(null);
    try {
      await apiService.approveUser(id);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, approved: true } : u));
    } catch (e) {
      setError('Erro ao aprovar usuário.');
    } finally {
      setApprovingId(null);
    }
  };

  if (user?.userType !== 'ADMINISTRADOR') {
    return <Typography>Você não tem permissão para acessar esta página.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>Usuários do Sistema</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome de Usuário</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Aprovado</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : (
                users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.userType}</TableCell>
                    <TableCell>{u.approved ? 'Sim' : 'Não'}</TableCell>
                    <TableCell>
                      {!u.approved && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          disabled={approvingId === u.id}
                          onClick={() => handleApprove(u.id)}
                        >
                          {approvingId === u.id ? <CircularProgress size={18} /> : 'Aprovar'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default UserListPage; 