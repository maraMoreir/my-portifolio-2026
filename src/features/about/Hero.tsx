import React, { lazy, Suspense } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container, Section } from '../../shared/components/Layout';

const ThreeOrb = lazy(() =>
  import('../../shared/components/ThreeOrb').then((module) => ({
    default: module.ThreeOrb,
  }))
);

const HeroContainer = styled(Section)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: center;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const TextContent = styled.div`
  z-index: 10;
`;

const Headline = styled(motion.h1)`
  font-size: ${({ theme }) => theme.fontSizes.xxxl};
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.text},
    ${({ theme }) => theme.colors.glow}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
  }
`;

const Description = styled(motion.p)`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.8;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
`;

const VisualContent = styled.div`
  position: relative;
  z-index: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    order: -1;
    height: 400px;
  }
`;

const LoadingFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

export const Hero: React.FC = () => {
  return (
    <HeroContainer id="hero" aria-label="Hero section">
      <Container $maxWidth="1400px">
        <HeroContent>
          <TextContent>
            <Headline
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              as="h1"
              role="heading"
              aria-level={1}
            >
              Transformando códigos em soluções escaláveis e resilientes.
            </Headline>
            <Description
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Desenvolvedora Web Full Stack com foco em Back-End, integrações
              corporativas e arquitetura de sistemas. Experiência na construção
              de APIs robustas, processamento de documentos fiscais eletrônicos
              e integração com ambientes enterprise como SAP. Atua aplicando
              Clean Architecture, boas práticas de engenharia e desenvolvimento
              orientado à manutenibilidade e evolução contínua.
            </Description>
          </TextContent>
          
          <VisualContent aria-label="3D visualization">
            <Suspense fallback={<LoadingFallback>Carregando visualização 3D...</LoadingFallback>}>
              <ThreeOrb />
            </Suspense>
          </VisualContent>
        </HeroContent>
      </Container>
    </HeroContainer>
  );
};
