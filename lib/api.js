// lib/api.js
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const TOKEN_KEY = 'cb_session_token';

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

/**
 * fetch() against the backend that automatically attaches the stored
 * session token as a Bearer Authorization header, if one exists. Every
 * per-user route (keywords, locations, monitored emails, alerts,
 * notifications, stats) requires this as of Phase 2.
 */
export function apiFetch(path, options = {}) {
  const token = getStoredToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(`${BACKEND_URL}${path}`, { ...options, headers });
}
