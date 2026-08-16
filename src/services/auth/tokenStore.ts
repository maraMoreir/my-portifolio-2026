/**
 * Holds the access token in memory only — a plain module-level variable,
 * never localStorage/sessionStorage. It's gone on reload by design; the
 * page recovers the session via authApiService.refresh(), which relies on
 * the HttpOnly refresh cookie the browser holds, not on anything readable
 * by JavaScript. This is what keeps the token safe from XSS: a script that
 * can run in this page could read this variable too, but it can't persist
 * or exfiltrate it any more easily than it could just call the API
 * directly — the real defense is the token's short (15 min) lifetime.
 */
let accessToken: string | null = null;

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const clearAccessToken = (): void => {
  accessToken = null;
};
