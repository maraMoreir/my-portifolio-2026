import { apiFetch } from './http/httpClient';
import { setAccessToken, clearAccessToken } from './auth/tokenStore';
import type { User } from '../entities/user/types';

interface LoginResponse {
  accessToken: string;
  accessTokenExpiresAt: string;
  user: User;
}

/** Authenticates and stores the access token in memory (see tokenStore). */
export const login = async (email: string, password: string): Promise<User> => {
  const data = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });
  setAccessToken(data.accessToken);
  return data.user;
};

/**
 * Attempts to restore a session using the HttpOnly refresh cookie. Called
 * once on app load — returns null (not a thrown error) when there's no
 * valid session, which is the expected case for most visits.
 */
export const refresh = async (): Promise<User | null> => {
  try {
    const data = await apiFetch<LoginResponse>('/auth/refresh', {
      method: 'POST',
      skipAuth: true,
    });
    setAccessToken(data.accessToken);
    return data.user;
  } catch {
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiFetch<void>('/auth/logout', { method: 'POST', skipAuth: true });
  } finally {
    clearAccessToken();
  }
};
