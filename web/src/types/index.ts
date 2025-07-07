export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  registrationNumber: string;
  userType: 'ALUNO' | 'PROFESSOR' | 'ADMINISTRADOR';
  approved: boolean;
  createdAt: string;
  password?: string;
  eventMemberships?: EventMember[];
  createdEvents?: Event[];
}

export interface Event {
  id: number;
  title: string;
  description: string;
  eventType: 'PROVA' | 'TRABALHO' | 'FESTA' | 'REUNIAO' | 'OUTRO';
  date: string;
  organizer: {
    id: number;
    username: string;
  };
  members: EventMember[];
}

export interface EventMember {
  id: number;
  user: {
    id: number;
    username: string;
  };
  event: {
    id: number;
    title: string;
  };
  joinedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  username: string;
  userType: 'ALUNO' | 'PROFESSOR' | 'ADMINISTRADOR';
  message: string | null;
}

export interface RegisterRequest {
  username: string;
  email: string;
  phone: string;
  password: string;
  registrationNumber: string;
  userType: 'ALUNO' | 'PROFESSOR' | 'ADMINISTRADOR';
}

export interface CreateEventRequest {
  title: string;
  description: string;
  eventType: EventType;
  date: string;
  memberIds: number[];
}

export interface UpdateEventRequest {
  title: string;
  description: string;
  eventType: 'PROVA' | 'TRABALHO' | 'FESTA' | 'REUNIAO' | 'OUTRO';
  date: string;
  memberIds?: number[];
}

export interface UpdateUserRequest {
  username: string;
  email: string;
  phone: string;
  registrationNumber: string;
  userType: 'ALUNO' | 'PROFESSOR' | 'ADMINISTRADOR';
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export type EventType = 'PROVA' | 'TRABALHO' | 'FESTA' | 'REUNIAO' | 'OUTRO'; 