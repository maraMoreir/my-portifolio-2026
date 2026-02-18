import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './theme/theme';
import { GlobalStyles } from './shared/styles/GlobalStyles';
import { AuthProvider } from './features/auth/AuthProvider';
import { Hero } from './features/about/Hero';
import { About } from './features/about/About';
import { Technologies } from './features/about/Technologies';
import { Engineering } from './features/about/Engineering';
import { Blog } from './features/blog/Blog';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AuthProvider>
          <Hero />
          <About />
          <Technologies />
          <Engineering />
          <Blog />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
