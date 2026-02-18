import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container, Section, Grid } from '../../shared/components/Layout';
import { Card, Tag } from '../../shared/components/Card';

const TechContainer = styled(Section)``;

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

const CategoryCard = styled(Card)``;

const CategoryTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.glow};
`;

const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const technologies = [
  {
    category: 'Frontend',
    techs: ['React', 'TypeScript', 'Next.js', 'Styled-components', 'HTML5', 'CSS3'],
  },
  {
    category: 'Backend',
    techs: ['C#', '.NET / ASP.NET Core', 'Entity Framework Core', 'APIs REST'],
  },
  {
    category: 'Dados & Infra',
    techs: ['SQL Server', 'MySQL', 'Docker', 'RabbitMQ', 'AWS'],
  },
  {
    category: 'Enterprise & Integração',
    techs: ['SAP', 'Integrações Corporativas', 'NF-e / NFSe / DFe', 'Sistemas Legados'],
  },
];

export const Technologies: React.FC = () => {
  return (
    <TechContainer id="technologies">
      <Container>
        <Title
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Tecnologias
        </Title>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid columns={2}>
            {technologies.map((tech, index) => (
              <CategoryCard key={index}>
                <CategoryTitle>{tech.category}</CategoryTitle>
                <TechList>
                  {tech.techs.map((item, i) => (
                    <Tag key={i}>{item}</Tag>
                  ))}
                </TechList>
              </CategoryCard>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </TechContainer>
  );
};
