import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  User,
  Event,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  CreateEventRequest,
  UpdateEventRequest,
  UpdateUserRequest,
  ApiResponse,
  EventMember
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Token adicionado à requisição:', config.url);
        console.log('📋 Método:', config.method?.toUpperCase());
        console.log('🔑 Token (primeiros 20 chars):', token.substring(0, 20) + '...');
      } else {
        console.log('⚠️ Nenhum token encontrado para:', config.url);
      }
      return config;
    });

    // Interceptor para tratamento de erros
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ Requisição bem-sucedida:', response.config.url);
        return response;
      },
      (error) => {
        console.error('❌ Erro na requisição:', error.config?.url);
        console.error('📊 Status:', error.response?.status);
        console.error('📝 Mensagem:', error.response?.data);
        
        if (error.response?.status === 401) {
          console.log('🚪 Token inválido, redirecionando para login...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Autenticação
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<string>> {
    const response: AxiosResponse<ApiResponse<string>> = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async testAuth(): Promise<string> {
    const response: AxiosResponse<string> = await this.api.get('/auth/test');
    return response.data;
  }

  // Usuários
  async getAllUsers(): Promise<User[]> {
    console.log('📞 getAllUsers chamado - fazendo requisição para /users/summary');
    const response: AxiosResponse<User[]> = await this.api.get('/users/summary');
    console.log('✅ getAllUsers resposta recebida:', response.data);
    return response.data;
  }

  async getUserById(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async getUsersByType(userType: string): Promise<User[]> {
    const response: AxiosResponse<User[]> = await this.api.get(`/users/type/${userType}`);
    return response.data;
  }

  async getPendingUsers(): Promise<User[]> {
    const response: AxiosResponse<User[]> = await this.api.get('/users/pending');
    return response.data;
  }

  async approveUser(id: number): Promise<void> {
    await this.api.put(`/users/${id}/approve`);
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  // Eventos
  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    console.log('🎯 Criando evento com dados:', eventData);
    console.log('🔑 Token atual:', localStorage.getItem('token')?.substring(0, 20) + '...');
    
    const response: AxiosResponse<Event> = await this.api.post('/events', eventData);
    console.log('✅ Evento criado com sucesso:', response.data);
    return response.data;
  }

  async getUserEvents(): Promise<Event[]> {
    const response: AxiosResponse<Event[]> = await this.api.get('/events');
    return response.data;
  }

  async getAllEvents(): Promise<Event[]> {
    const response: AxiosResponse<Event[]> = await this.api.get('/events/all');
    return response.data;
  }

  async getEventById(id: number): Promise<Event> {
    const response: AxiosResponse<Event> = await this.api.get(`/events/${id}`);
    return response.data;
  }

  async getEventsByType(eventType: string): Promise<Event[]> {
    const response: AxiosResponse<Event[]> = await this.api.get(`/events/type/${eventType}`);
    return response.data;
  }

  async getAcademicEvents(): Promise<Event[]> {
    const response: AxiosResponse<Event[]> = await this.api.get('/events/academic');
    return response.data;
  }

  async getPartyEvents(): Promise<Event[]> {
    const response: AxiosResponse<Event[]> = await this.api.get('/events/party');
    return response.data;
  }

  async getEventMembers(eventId: number): Promise<EventMember[]> {
    const response: AxiosResponse<EventMember[]> = await this.api.get(`/events/${eventId}/members`);
    return response.data;
  }

  async updateEvent(id: number, eventData: UpdateEventRequest): Promise<Event> {
    const response: AxiosResponse<Event> = await this.api.put(`/events/${id}`, eventData);
    return response.data;
  }

  async deleteEvent(id: number): Promise<void> {
    await this.api.delete(`/events/${id}`);
  }

  async addEventMember(eventId: number, userId: number): Promise<Event> {
    const response: AxiosResponse<Event> = await this.api.post(`/events/${eventId}/members/${userId}`);
    return response.data;
  }

  async removeEventMember(eventId: number, userId: number): Promise<void> {
    await this.api.delete(`/events/${eventId}/members/${userId}`);
  }
}

export const apiService = new ApiService();
export default apiService; 