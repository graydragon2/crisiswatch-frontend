'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch, getStoredToken, setStoredToken, clearStoredToken } from './api';

export { getStoredToken, setStoredToken, clearStoredToken };

export function logout(router) {
  clearStoredToken();
  router.push('/login');
}

/**
 * Verifies the stored session token against the backend and redirects to
 * /login if there isn't a valid one. AppShell uses this to gate every
 * dashboard page behind auth.
 */
export function useRequireAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getStoredToken()) {
      router.replace('/login');
      return;
    }
    apiFetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('invalid session');
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        clearStoredToken();
        router.replace('/login');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, loading };
}
