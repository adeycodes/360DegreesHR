import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { getAccessToken } from "@/lib/session";

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
    const token = getAccessToken();
    if (token && !isAuthenticated) {
      setIsSessionValid(true);
    } else if (!token && isAuthenticated) {
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
