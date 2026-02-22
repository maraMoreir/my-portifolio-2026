import styled from 'styled-components';

export const SkipLink = styled.a`
  position: absolute;
  top: -40px;
  left: 0;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  text-decoration: none;
  z-index: 100;
  border-radius: ${({ theme }) => theme.radius.sm};

  &:focus {
    top: ${({ theme }) => theme.spacing.sm};
    left: ${({ theme }) => theme.spacing.sm};
  }
`;
