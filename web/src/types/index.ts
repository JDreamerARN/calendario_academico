export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  password?: string;
  eventMemberships?: EventMember[];
  createdEvents?: Event[];
}

export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
  };
  createdAt: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  tags: string[];
  date: string;
  organizer: {
    id: number;
    username: string;
  };
  members: EventMember[];
  comments?: Comment[];
}

export interface EventMember {
  id: number;
  user: {
    id: number;
    username: string;
  };
  event?: {
    id: number;
    title: string;
  };
  joinedAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  username: string;
  message: string | null;
}

export interface RegisterRequest {
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  tags: string[];
  date: string;
  memberIds: number[];
}

export interface UpdateEventRequest {
  title: string;
  description: string;
  tags: string[];
  date: string;
  memberIds?: number[];
}

export interface UpdateUserRequest {
  username: string;
  email: string;
  phone: string;
}

export interface CommentRequest {
  content: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface UserSummary {
  id: number;
  username: string;
  email: string;
}
