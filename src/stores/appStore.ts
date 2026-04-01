import { create } from 'zustand'

type AppPhase = 'landing' | 'video' | 'desktop'

interface AppStore {
  phase: AppPhase
  isMuted: boolean
  startMenuOpen: boolean
  
  setPhase: (phase: AppPhase) => void
  toggleMute: () => void
  setStartMenuOpen: (open: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  phase: 'landing',
  isMuted: false,
  startMenuOpen: false,

  setPhase: (phase) => set({ phase }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setStartMenuOpen: (open) => set({ startMenuOpen: open }),
}))
