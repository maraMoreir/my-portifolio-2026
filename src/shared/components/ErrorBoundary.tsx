import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const ErrorTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  max-width: 600px;
`;

const ErrorButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.fontSizes.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.glow};
    transform: translateY(-2px);
  }
`;

// TODO: Implement i18n for multi-language support
const ErrorStrings = {
  title: 'Algo deu errado',
  message: 'Desculpe, ocorreu um erro inesperado. Por favor, tente novamente.',
  button: 'Tentar Novamente',
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorTitle>{ErrorStrings.title}</ErrorTitle>
          <ErrorMessage>{ErrorStrings.message}</ErrorMessage>
          {this.state.error && import.meta.env.DEV && (
            <ErrorMessage style={{ fontSize: '14px', fontFamily: 'monospace' }}>
              {this.state.error.message}
            </ErrorMessage>
          )}
          <ErrorButton onClick={this.handleReset}>{ErrorStrings.button}</ErrorButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}
