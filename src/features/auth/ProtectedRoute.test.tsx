import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from './hooks';

vi.mock('./hooks');

const mockedUseAuth = vi.mocked(useAuth);

const baseAuth = {
  user: null,
  error: null,
  login: vi.fn(),
  logout: vi.fn(),
};

const renderProtected = () =>
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <div>Secret dashboard</div>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe('ProtectedRoute', () => {
  it('shows a loading state while auth is still resolving, without rendering the route', () => {
    mockedUseAuth.mockReturnValue({ ...baseAuth, isAuthenticated: false, isLoading: true });

    renderProtected();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Secret dashboard')).not.toBeInTheDocument();
  });

  it('redirects an unauthenticated visitor to /admin/login instead of rendering the route', () => {
    mockedUseAuth.mockReturnValue({ ...baseAuth, isAuthenticated: false, isLoading: false });

    renderProtected();

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Secret dashboard')).not.toBeInTheDocument();
  });

  it('renders the protected content for an authenticated admin', () => {
    mockedUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', email: 'admin@example.com', name: 'Admin', roles: ['Admin'] },
    });

    renderProtected();

    expect(screen.getByText('Secret dashboard')).toBeInTheDocument();
  });
});
