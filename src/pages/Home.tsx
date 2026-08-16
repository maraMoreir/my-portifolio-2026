import React from 'react';
import { Hero } from '../features/about/Hero';
import { Technologies } from '../features/about/Technologies';
import { Engineering } from '../features/about/Engineering';
import { Blog } from '../features/blog/Blog';

/** Public landing page — the site's only route today. */
export const Home: React.FC = () => (
  <>
    <Hero />
    <Technologies />
    <Engineering />
    <Blog />
  </>
);
