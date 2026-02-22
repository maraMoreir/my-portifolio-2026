import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Container, Section, Grid } from "../../shared/components/Layout";
import { Card } from "../../shared/components/Card";

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
    icon: "🛡️",
    name: "Sistemas Resilientes",
    description:
      "Aplicações preparadas para falhas com retry strategies, isolamento de serviços e graceful degradation.",
  },
  {
    icon: "🔧",
    name: "Código Manutenível",
    description: "Código modular, testável e orientado à evolução contínua.",
  },
  {
    icon: "🏗️",
    name: "Arquitetura Desacoplada",
    description:
      "Separação clara de responsabilidades com baixo acoplamento e alta coesão.",
  },
  {
    icon: "📊",
    name: "Observabilidade",
    description:
      "Logging estruturado, métricas e tracing distribuído para monitoramento em produção.",
  },
  {
    icon: "🔐",
    name: "Segurança por Design",
    description:
      "Validação de entrada, autenticação segura e proteção contra vulnerabilidades desde o design da solução.",
  },
  {
    icon: "⚡",
    name: "APIs de Alta Performance",
    description:
      "APIs REST com validação consistente, controle de acesso e foco em performance.",
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
          Performance & Segurança
        </Title>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid $columns={2}>
            {features.map((feature, index) => (
              <FeatureCard key={index} $glass>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.name}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </EngineeringContainer>
  );
};
