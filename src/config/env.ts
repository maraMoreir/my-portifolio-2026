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

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const env = {
  /** Base URL of the backend API. Defaults to a same-origin "/api" until the .NET API is deployed. */
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', '/api'),
  /**
   * Whether a real backend has been explicitly configured. Services that
   * still have a mock fallback (e.g. the public blog listing) use this to
   * decide which implementation to call — see services/postsService.ts.
   * Deliberately independent of `apiBaseUrl`'s fallback value, so the app
   * keeps working on mocks until a real API URL is actually provided.
   */
  hasApi: Boolean(rawApiBaseUrl && rawApiBaseUrl.length > 0),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
