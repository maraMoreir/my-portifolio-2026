import styled from 'styled-components';

export const Container = styled.div<{ $maxWidth?: string }>`
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

export const Section = styled.section<{ $background?: string }>`
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  background: ${({ $background }) => $background || 'transparent'};
  min-height: 100vh;
  display: flex;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl} 0;
    min-height: auto;
  }
`;

export const Grid = styled.div<{ $columns?: number; $gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 3}, 1fr);
  gap: ${({ $gap, theme }) => $gap || theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const Flex = styled.div<{
  $direction?: 'row' | 'column';
  $align?: string;
  $justify?: string;
  $gap?: string;
}>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction || 'row'};
  align-items: ${({ $align }) => $align || 'stretch'};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
  gap: ${({ $gap, theme }) => $gap || theme.spacing.md};
`;
