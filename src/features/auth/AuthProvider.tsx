import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthState } from '../../infrastructure/auth/types';
import { authService } from '../../infrastructure/auth/authService';

interface AuthContextValue extends AuthState {
  login: (provider: 'azure' | 'google' | 'oauth2') => Promise<void>;
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
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const isValid = await authService.validateToken(token);
          if (isValid) {
            const user = await authService.getCurrentUser(token);
            setState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return;
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
    };

    checkSession();
  }, []);

  const login = async (provider: 'azure' | 'google' | 'oauth2') => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await authService.login(provider);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      });
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await authService.logout();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
