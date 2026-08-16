import { env } from '../../config/env';
import { getAccessToken, setAccessToken, clearAccessToken } from '../auth/tokenStore';

export class ApiError extends Error {
  readonly status: number;
  readonly detail?: string;

  constructor(status: number, message: string, detail?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

interface ApiFetchOptions extends RequestInit {
  /** Skip attaching the Authorization header — for public/auth endpoints. */
  skipAuth?: boolean;
}

let refreshInFlight: Promise<boolean> | null = null;

/**
 * Calls POST /auth/refresh using the HttpOnly cookie the browser already
 * holds. De-duplicated so concurrent 401s from several requests trigger a
 * single refresh instead of a stampede.
 */
const refreshAccessToken = (): Promise<boolean> => {
  refreshInFlight ??= (async () => {
    try {
      const response = await fetch(`${env.apiBaseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        clearAccessToken();
        return false;
      }
      const data = (await response.json()) as { accessToken: string };
      setAccessToken(data.accessToken);
      return true;
    } catch {
      clearAccessToken();
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
};

const buildRequest = (skipAuth: boolean | undefined, headers: HeadersInit | undefined): HeadersInit => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };
};

/**
 * Thin fetch wrapper used by every service that talks to the .NET API —
 * components and hooks never call fetch directly. Attaches the in-memory
 * access token, always sends credentials (needed for the refresh cookie),
 * transparently retries once after a silent refresh on 401, and maps
 * failures to ApiError with the backend's ProblemDetails message.
 */
export const apiFetch = async <T>(path: string, options: ApiFetchOptions = {}): Promise<T> => {
  const { skipAuth, headers, ...rest } = options;

  const doFetch = () =>
    fetch(`${env.apiBaseUrl}${path}`, {
      ...rest,
      credentials: 'include',
      headers: buildRequest(skipAuth, headers),
    });

  let response = await doFetch();

  if (response.status === 401 && !skipAuth && getAccessToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      response = await doFetch();
    }
  }

  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      problem?.title ?? `Erro inesperado (HTTP ${response.status})`,
      problem?.detail,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
