"use client";

import { useEffect } from "react";

import { authApi } from "@/lib/api/endpoints/auth";
import { getAccessToken } from "@/lib/utilities";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Rehydrates auth from storage and refreshes user via GET /auth/me when token exists.
 */
export function AuthHydration({ children }: { children: React.ReactNode }) {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setSession = useAuthStore((s) => s.setSession);
  const setUser = useAuthStore((s) => s.setUser);
  const clearSession = useAuthStore((s) => s.clearSession);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const token = getAccessToken();
    if (isAuthenticated) {
      authApi.me().then(setUser).catch(() => clearSession());
      return;
    }

    if (token) {
      authApi
        .me()
        .then((user) => setSession({ token, user }))
        .catch(() => clearSession());
    }
  }, [isHydrated, isAuthenticated, setSession, setUser, clearSession]);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return unsub;
  }, [setHydrated]);

  return <>{children}</>;
}
