/**
 * Centralized, typed access to build-time environment variables.
 *
 * Vite only exposes variables prefixed with `VITE_` to client code (see
 * https://vite.dev/guide/env-and-mode.html) and inlines them at build time,
 * so none of this ever leaks secrets — anything read here is already public
 * once shipped. Real secrets (JWT signing keys, DB connection strings, etc.)
 * belong exclusively to the backend and must never be read from here.
 *
 * Add new variables to `.env.example` when introducing them so the required
 * configuration stays documented for anyone setting up the project.
 */

const getEnvVar = (key: string, fallback?: string): string => {
  const value = import.meta.env[key] as string | undefined;
  if (value === undefined || value === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  /** Base URL of the backend API. Defaults to a same-origin "/api" until the .NET API is deployed. */
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', '/api'),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
