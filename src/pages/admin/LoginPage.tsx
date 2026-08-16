import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Section } from '../../shared/components/Layout';
import { Card, Button } from '../../shared/components/Card';
import { FormGroup, Label, Input, ErrorText } from '../../shared/components/Form';
import { useAuth } from '../../features/auth/hooks';

const LoginSection = styled(Section)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (isAuthenticated) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/admin';
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch {
      setFormError('E-mail ou senha inválidos.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LoginSection>
      <Container $maxWidth="480px">
        <LoginCard>
          <Title>Área administrativa</Title>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>
            {formError && <ErrorText role="alert">{formError}</ErrorText>}
            <Button type="submit" disabled={submitting || isLoading} style={{ width: '100%', marginTop: 8 }}>
              {submitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </LoginCard>
      </Container>
    </LoginSection>
  );
};
