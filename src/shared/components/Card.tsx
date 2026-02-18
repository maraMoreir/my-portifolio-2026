import styled from 'styled-components';

export const Card = styled.div<{ $glass?: boolean }>`
  background: ${({ $glass }) =>
    $glass
      ? 'rgba(255, 255, 255, 0.05)'
      : `linear-gradient(135deg, rgba(123, 44, 255, 0.1), rgba(77, 163, 255, 0.05))`};
  backdrop-filter: ${({ $glass }) => ($glass ? 'blur(10px)' : 'none')};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: all ${({ theme }) => theme.transition.normal};
  box-shadow: ${({ theme }) => theme.shadows.card};

  &:hover {
    transform: translateY(-5px);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  transition: all ${({ theme }) => theme.transition.fast};
  cursor: pointer;
  background: ${({ $variant, theme }) =>
    $variant === 'secondary'
      ? 'transparent'
      : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`};
  color: ${({ theme }) => theme.colors.text};
  border: ${({ $variant, theme }) =>
    $variant === 'secondary' ? `2px solid ${theme.colors.primary}` : 'none'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const Tag = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: rgba(123, 44, 255, 0.2);
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.glow};
  font-weight: 600;
  text-transform: uppercase;
`;
