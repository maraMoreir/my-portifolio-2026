import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface FadeInWhenVisibleProps
  extends Omit<HTMLMotionProps<'div'>, 'initial' | 'whileInView' | 'viewport'> {
  /** Animation delay in seconds, applied on top of the shared transition. */
  delay?: number;
}

/**
 * Wraps content in the fade-up-on-scroll animation repeated across the
 * landing sections (Blog, Engineering, Technologies), so the motion
 * config lives in a single place instead of being copy-pasted per section.
 */
export const FadeInWhenVisible: React.FC<FadeInWhenVisibleProps> = ({
  delay = 0,
  transition,
  children,
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ...transition }}
    {...props}
  >
    {children}
  </motion.div>
);
