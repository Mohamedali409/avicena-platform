import { create } from "zustand";

// Shared UI state for the portal shell. Currently the mobile sidebar drawer:
// the header's hamburger toggles it, the sidebar reads it for its transform,
// and it auto-closes on route change. On md+ the sidebar is always visible so
// this state has no visual effect there.
interface SidebarState {
  open: boolean;
  toggle: () => void;
  close: () => void;
  setOpen: (v: boolean) => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  open: false,
  toggle: () => set((s) => ({ open: !s.open })),
  close: () => set({ open: false }),
  setOpen: (v) => set({ open: v }),
}));
