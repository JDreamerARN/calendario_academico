import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import apiService from '../services/api';
import type { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (token) {
      console.log('Token do usuário atualizado:', token);
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      console.log('Iniciando login para usuário:', username);
      
      const response = await apiService.login({ username, password });
      console.log('Login bem-sucedido, ID do usuário:', response.id);

      // Salvar o token imediatamente após o login
      setToken(response.token);
      localStorage.setItem('token', response.token);
      console.log('Token do usuário salvo imediatamente após login:', response.token);

      // Buscar dados completos do usuário usando o ID retornado
      console.log('Buscando dados completos do usuário...');
      const userData = await apiService.getUserById(response.id);
      console.log('Dados do usuário obtidos:', userData);

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      console.log('Login concluído com sucesso');
    } catch (error: unknown) {
      console.error('Erro detalhado no login:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error('Status:', axiosError.response.status);
          console.error('Dados:', axiosError.response.data);
        }
      }
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Iniciando logout - limpando todos os dados...');
    
    // Limpar estado local
    setUser(null);
    setToken(null);
    
    // Limpar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpar cache do React Query
    queryClient.clear();
    console.log('🧹 Cache do React Query limpo');
    
    // Limpar qualquer outro dado que possa estar armazenado
    // Limpar sessionStorage também
    sessionStorage.clear();
    console.log('🧹 SessionStorage limpo');
    
    // Limpar cookies relacionados à aplicação (se houver)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    console.log('🧹 Cookies limpos');
    
    // Limpar dados específicos que podem estar armazenados
    // Limpar dados de eventos, usuários, etc.
    localStorage.removeItem('events');
    localStorage.removeItem('users');
    localStorage.removeItem('selectedDate');
    localStorage.removeItem('eventTypeFilter');
    localStorage.removeItem('userTypeFilter');
    console.log('🧹 Dados específicos da aplicação limpos');
    
    // Forçar recarregamento da página para garantir limpeza completa
    // Isso garante que nenhum estado residual permaneça na memória
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
    
    console.log('✅ Logout concluído - todos os dados foram limpos');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 