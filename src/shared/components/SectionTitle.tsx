import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

const StyledTitle = styled(motion.h2)`
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

type SectionTitleProps = HTMLMotionProps<'h2'>;

/**
 * Gradient section heading with the fade-in-on-view animation shared by
 * every landing section (Blog, Engineering, Technologies). Animation props
 * can still be overridden via props when a section needs a different one.
 */
export const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  ...props
}) => (
  <StyledTitle
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    {...props}
  >
    {children}
  </StyledTitle>
);
