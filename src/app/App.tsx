import React, { lazy, Suspense, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { theme } from "../theme/theme";
import { GlobalStyles } from "../shared/styles/GlobalStyles";
import { AuthProvider } from "../features/auth/AuthProvider";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { ErrorBoundary } from "../shared/components/ErrorBoundary";
import { SkipLink } from "../shared/components/SkipLink";
import { Header } from "../features/navigation/Header";
import { Footer } from "../features/navigation/Footer";
import { Home } from "../pages/Home";

// Code-split like ThreeOrb: react-markdown/remark-gfm and the whole admin
// area are meaningful weight that most visitors (reading the public site)
// never need to download at all.
const PostPage = lazy(() => import("../pages/PostPage").then((m) => ({ default: m.PostPage })));
const LoginPage = lazy(() => import("../pages/admin/LoginPage").then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import("../pages/admin/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const PostEditorPage = lazy(() => import("../pages/admin/PostEditorPage").then((m) => ({ default: m.PostEditorPage })));

const RouteFallback: React.FC = () => (
  <div style={{ padding: "64px", textAlign: "center" }}>Carregando...</div>
);

// Needs to be inside <BrowserRouter> to read the current location.
const AppRoutes: React.FC = () => {
  const location = useLocation();

  // Completes the "navigate home, then scroll" half of useSectionNav: the
  // header/footer nav links from a non-home route (post detail, admin)
  // land here on "/#section" — once Home has mounted, scroll to it.
  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return;

    const id = location.hash.slice(1);
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  return (
    <AuthProvider>
      <Header />
      <main role="main" id="main-content" style={{ paddingTop: "64px" }}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* keyed by path so navigating between two post permalinks resets PostPage's local state instead of flashing stale content */}
            <Route path="/blog/:slug" element={<PostPage key={location.pathname} />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/posts/new"
              element={
                <ProtectedRoute>
                  <PostEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/posts/:id/edit"
              element={
                <ProtectedRoute>
                  <PostEditorPage key={location.pathname} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </AuthProvider>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <SkipLink href="#main-content">
            Pular para o conteúdo principal
          </SkipLink>
          <AppRoutes />
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
