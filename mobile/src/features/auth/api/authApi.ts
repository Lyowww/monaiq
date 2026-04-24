import type {
  AuthSessionResponse,
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
  UserProfile
} from '@ai-finance/shared-types';
import { apiRequest } from '../../../lib/http/apiClient';

export const authApi = {
  login(payload: LoginRequest): Promise<AuthSessionResponse> {
    return apiRequest<AuthSessionResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  register(payload: RegisterRequest): Promise<AuthSessionResponse> {
    return apiRequest<AuthSessionResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  refresh(payload: RefreshRequest): Promise<AuthSessionResponse> {
    return apiRequest<AuthSessionResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  me(): Promise<UserProfile> {
    return apiRequest<UserProfile>('/auth/me', {
      method: 'GET',
      requiresAuth: true
    });
  }
};
