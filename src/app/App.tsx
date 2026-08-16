import React from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { theme } from "../theme/theme";
import { GlobalStyles } from "../shared/styles/GlobalStyles";
import { AuthProvider } from "../features/auth/AuthProvider";
import { ErrorBoundary } from "../shared/components/ErrorBoundary";
import { SkipLink } from "../shared/components/SkipLink";
import { Header } from "../features/navigation/Header";
import { Footer } from "../features/navigation/Footer";
import { Home } from "../pages/Home";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <SkipLink href="#main-content">
            Pular para o conteúdo principal
          </SkipLink>
          <AuthProvider>
            <Header />
            <main role="main" id="main-content" style={{ paddingTop: "64px" }}>
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
