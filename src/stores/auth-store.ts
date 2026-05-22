import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { AuthSession, AuthUser } from "@/lib/validations/auth";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/auth/session";

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setSession: (session: AuthSession) => void;
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
  setHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      setSession: (session) => {
        setAccessToken(session.token);
        set({
          user: session.user,
          isAuthenticated: true,
          isHydrated: true,
        });
      },

      setUser: (user) => set({ user }),

      clearSession: () => {
        clearAccessToken();
        set({ user: null, isAuthenticated: false });
      },

      setHydrated: (isHydrated) => set({ isHydrated }),
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
