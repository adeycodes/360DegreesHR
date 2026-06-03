/**
 * Custom hook for authentication logic
 * Combines auth store with session management
 */

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { getAccessToken } from "@/lib/auth/session";

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isHydrated,
    setSession,
    clearSession,
    setHydrated,
  } = useAuthStore();

  const [isSessionValid, setIsSessionValid] = useState(false);

  useEffect(() => {
    // Check if session token exists on mount
    const token = getAccessToken();
    if (token && !isAuthenticated) {
      // Token exists but auth store says not authenticated - sync them
      setIsSessionValid(true);
    } else if (!token && isAuthenticated) {
      // No token but auth store says authenticated - clear it
      clearSession();
    } else {
      setIsSessionValid(isAuthenticated);
    }
  }, [isAuthenticated, clearSession]);

  return {
    user,
    isAuthenticated: isAuthenticated && isSessionValid,
    isHydrated,
    setSession,
    clearSession,
    setHydrated,
  };
}
