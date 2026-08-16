import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from './AuthProvider';
import { useAuth } from './hooks';
import * as authApiService from '../../services/authApiService';

vi.mock('../../services/authApiService');

const mockedAuthApiService = vi.mocked(authApiService);

const adminUser = { id: '1', email: 'admin@example.com', name: 'Admin', roles: ['Admin'] };

const TestConsumer: React.FC = () => {
  const { user, isAuthenticated, isLoading, error, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="user">{user?.name ?? 'none'}</span>
      <span data-testid="error">{error ?? 'none'}</span>
      <button onClick={() => login('admin@example.com', 'secret').catch(() => {})}>login</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
};

const renderWithProvider = () =>
  render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>,
  );

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('stays unauthenticated when there is no valid session to restore', async () => {
    mockedAuthApiService.refresh.mockResolvedValue(null);

    renderWithProvider();

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('restores an authenticated session from the refresh cookie on load', async () => {
    mockedAuthApiService.refresh.mockResolvedValue(adminUser);

    renderWithProvider();

    await waitFor(() => expect(screen.getByTestId('authenticated')).toHaveTextContent('true'));
    expect(screen.getByTestId('user')).toHaveTextContent('Admin');
  });

  it('login sets the authenticated user on success', async () => {
    mockedAuthApiService.refresh.mockResolvedValue(null);
    mockedAuthApiService.login.mockResolvedValue(adminUser);

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));

    await userEvent.click(screen.getByText('login'));

    await waitFor(() => expect(screen.getByTestId('authenticated')).toHaveTextContent('true'));
    expect(screen.getByTestId('user')).toHaveTextContent('Admin');
  });

  it('surfaces an error message on invalid credentials and stays unauthenticated', async () => {
    mockedAuthApiService.refresh.mockResolvedValue(null);
    mockedAuthApiService.login.mockRejectedValue(new Error('Credenciais inválidas.'));

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));

    await userEvent.click(screen.getByText('login'));

    await waitFor(() => expect(screen.getByTestId('error')).toHaveTextContent('Credenciais inválidas.'));
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('logout clears the session', async () => {
    mockedAuthApiService.refresh.mockResolvedValue(adminUser);
    mockedAuthApiService.logout.mockResolvedValue(undefined);

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('authenticated')).toHaveTextContent('true'));

    await userEvent.click(screen.getByText('logout'));

    await waitFor(() => expect(screen.getByTestId('authenticated')).toHaveTextContent('false'));
    expect(screen.getByTestId('user')).toHaveTextContent('none');
  });
});
