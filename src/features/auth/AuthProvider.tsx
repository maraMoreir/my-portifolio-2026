import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthState } from '../../entities/user/types';
import * as authApiService from '../../services/authApiService';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Restores the session (if any) using the HttpOnly refresh cookie —
    // there's nothing readable in localStorage to check anymore, so this
    // silent refresh call is the only way to know if the visitor is
    // already logged in after a page reload.
    let cancelled = false;

    const restoreSession = async () => {
      const user = await authApiService.refresh();
      if (cancelled) return;

      if (user) {
        setState({ user, isAuthenticated: true, isLoading: false, error: null });
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await authApiService.login(email, password);
      setState({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao autenticar';
      setState({ user: null, isAuthenticated: false, isLoading: false, error: message });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await authApiService.logout();
    } finally {
      setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Internal hook - use from hooks.ts instead
const useAuthInternal = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { useAuthInternal };
