/**
 * Zustand stores - consolidated into a single file to reduce redundancy
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { AuthSession, AuthUser } from "@/lib/validations";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/utilities";

// ============================================================================
// AUTH STORE
// ============================================================================

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

// ============================================================================
// UI STORE
// ============================================================================

type UiState = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  toggleMobileNav: () =>
    set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
}));

// ============================================================================
// TOAST STORE
// ============================================================================

export type ToastType = "success" | "error" | "info" | "warning";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

type ToastState = {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  dismissToast: (id: string) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const toast = {
  success: (message: string, duration?: number) =>
    useToastStore.getState().addToast(message, "success", duration),
  error: (message: string, duration?: number) =>
    useToastStore.getState().addToast(message, "error", duration),
  info: (message: string, duration?: number) =>
    useToastStore.getState().addToast(message, "info", duration),
  warning: (message: string, duration?: number) =>
    useToastStore.getState().addToast(message, "warning", duration),
};
