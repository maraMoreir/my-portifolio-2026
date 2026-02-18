import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container, Section, Grid } from '../../shared/components/Layout';
import { Card } from '../../shared/components/Card';

const AboutContainer = styled(Section)`
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.background} 0%,
    rgba(123, 44, 255, 0.05) 100%
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

const AboutText = styled(motion.p)`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;

const InterestCard = styled(Card)`
  text-align: center;
`;

const InterestIcon = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InterestTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const interests = [
  { icon: '🔗', title: 'Integração de Sistemas' },
  { icon: '📨', title: 'Mensageria' },
  { icon: '🏗️', title: 'Arquitetura Backend' },
  { icon: '📄', title: 'Sistemas Fiscais Eletrônicos' },
  { icon: '📊', title: 'Observabilidade' },
  { icon: '⚡', title: 'Performance e Segurança' },
];

export const About: React.FC = () => {
  return (
    <AboutContainer id="about">
      <Container>
        <Title
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Sobre
        </Title>
        
        <AboutText
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Especialista em resolver problemas complexos através de software
          sustentável. Experiência com sistemas distribuídos, integrações
          empresariais e modernização de código legado. Forte atuação em
          resiliência, desacoplamento arquitetural e construção de soluções
          preparadas para crescimento.
        </AboutText>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Grid columns={3}>
            {interests.map((interest, index) => (
              <InterestCard key={index} glass>
                <InterestIcon>{interest.icon}</InterestIcon>
                <InterestTitle>{interest.title}</InterestTitle>
              </InterestCard>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </AboutContainer>
  );
};
