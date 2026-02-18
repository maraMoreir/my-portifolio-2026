import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container, Section, Grid } from '../../shared/components/Layout';
import { Card } from '../../shared/components/Card';

const EngineeringContainer = styled(Section)`
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.background} 0%,
    rgba(77, 163, 255, 0.05) 100%
  );
`;

const Title = styled(motion.h2)`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FeatureCard = styled(Card)``;

const FeatureIcon = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const features = [
  {
    icon: '🛡️',
    title: 'Resiliência de Aplicações',
    description:
      'Construção de sistemas preparados para falhas, com retry patterns, circuit breakers e graceful degradation.',
  },
  {
    icon: '🔧',
    title: 'Manutenibilidade',
    description:
      'Código limpo, documentado e testável. Aplicação de design patterns e princípios SOLID.',
  },
  {
    icon: '♻️',
    title: 'Reutilização de Código',
    description:
      'Componentes modulares e bibliotecas compartilhadas que aceleram o desenvolvimento.',
  },
  {
    icon: '⚡',
    title: 'Processamento Assíncrono',
    description:
      'Utilização de filas, workers e event-driven architecture para alta performance.',
  },
  {
    icon: '🏗️',
    title: 'Arquitetura Desacoplada',
    description:
      'Separação de responsabilidades, baixo acoplamento e alta coesão nos componentes.',
  },
  {
    icon: '📊',
    title: 'Observabilidade',
    description:
      'Logging estruturado, métricas e tracing distribuído para monitoramento efetivo.',
  },
  {
    icon: '🔐',
    title: 'Segurança por Design',
    description:
      'Implementação de autenticação SSO, validação de entrada e proteção contra vulnerabilidades.',
  },
  {
    icon: '🚀',
    title: 'APIs Seguras',
    description:
      'Design de APIs REST com autenticação, rate limiting e validação robusta.',
  },
];

export const Engineering: React.FC = () => {
  return (
    <EngineeringContainer id="engineering">
      <Container>
        <Title
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Engenharia, Performance & Segurança
        </Title>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid columns={2}>
            {features.map((feature, index) => (
              <FeatureCard key={index} glass>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </EngineeringContainer>
  );
};
