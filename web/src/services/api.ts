import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  User,
  Event,
  Comment,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  CreateEventRequest,
  UpdateEventRequest,
  UpdateUserRequest,
  CommentRequest,
  ApiResponse,
  EventMember,
  UserSummary,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

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

  async getAllUsers(): Promise<UserSummary[]> {
    const response: AxiosResponse<UserSummary[]> = await this.api.get('/users/summary');
    return response.data;
  }

  async getUserById(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(`/users/${id}`, userData);
    return response.data;
  }

  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    const response: AxiosResponse<Event> = await this.api.post('/events', eventData);
    return response.data;
  }

  async getUserEvents(): Promise<Event[]> {
    const response: AxiosResponse<Event[]> = await this.api.get('/events');
    return response.data;
  }

  async getEventById(id: number): Promise<Event> {
    const response: AxiosResponse<Event> = await this.api.get(`/events/${id}`);
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

  async getComments(eventId: number): Promise<Comment[]> {
    const response: AxiosResponse<Comment[]> = await this.api.get(`/events/${eventId}/comments`);
    return response.data;
  }

  async addComment(eventId: number, data: CommentRequest): Promise<Comment> {
    const response: AxiosResponse<Comment> = await this.api.post(`/events/${eventId}/comments`, data);
    return response.data;
  }

  async deleteComment(eventId: number, commentId: number): Promise<void> {
    await this.api.delete(`/events/${eventId}/comments/${commentId}`);
  }
}

export const apiService = new ApiService();
export default apiService;
