import { create } from "zustand";

type UiState = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
};

/**
 * Global UI chrome state (sidebar, drawers, modals flags).
 * Add feature-specific stores alongside this file when MVP screens land.
 */
export const useUiStore = create<UiState>((set) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  toggleMobileNav: () =>
    set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
}));
