import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { AuthSession, AuthUser } from "@/types";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/session";

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  showSplash: boolean;
  isLoading: boolean;
  error: string | null;
  setSession: (session: AuthSession) => void;
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
  setHydrated: (value: boolean) => void;
  setShowSplash: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      showSplash: false,
      isLoading: false,
      error: null,

      setSession: (session) => {
        setAccessToken(session.token);
        set({
          user: session.user,
          isAuthenticated: true,
          isHydrated: true,
          showSplash: true,
          isLoading: false,
          error: null,
        });
      },

      setUser: (user) => set({ user }),

      clearSession: () => {
        clearAccessToken();
        set({
          user: null,
          isAuthenticated: false,
          showSplash: false,
          isLoading: false,
          error: null,
        });
      },

      setHydrated: (isHydrated) => set({ isHydrated }),
      setShowSplash: (showSplash) => set({ showSplash }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "360-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        const token = getAccessToken();
        if (state?.isAuthenticated && !token) {
          state.clearSession();
        }
        state?.setHydrated(true);
      },
    },
  ),
);
