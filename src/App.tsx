import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './theme/theme';
import { GlobalStyles } from './shared/styles/GlobalStyles';
import { AuthProvider } from './features/auth/AuthProvider';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { SkipLink } from './shared/components/SkipLink';
import { Hero } from './features/about/Hero';
import { About } from './features/about/About';
import { Technologies } from './features/about/Technologies';
import { Engineering } from './features/about/Engineering';
import { Blog } from './features/blog/Blog';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <SkipLink href="#main-content">Pular para o conteúdo principal</SkipLink>
          <AuthProvider>
            <main role="main" id="main-content">
              <Hero />
              <About />
              <Technologies />
              <Engineering />
              <Blog />
            </main>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
