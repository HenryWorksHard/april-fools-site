import { create } from 'zustand'

export interface WindowState {
  id: string
  title: string
  icon: string
  component: string
  x: number
  y: number
  width: number
  height: number
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
}

interface WindowStore {
  windows: WindowState[]
  activeWindowId: string | null
  highestZIndex: number
  cascadeOffset: number // Track cascade position
  
  openWindow: (window: Omit<WindowState, 'zIndex' | 'isMinimized' | 'isMaximized'>) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  updateWindowPosition: (id: string, x: number, y: number) => void
  updateWindowSize: (id: string, width: number, height: number) => void
}

// Windows XP cascade offset (pixels)
const CASCADE_STEP = 26
const CASCADE_MAX = 8 // Reset after this many windows
const CASCADE_START_X = 80
const CASCADE_START_Y = 40

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  highestZIndex: 100,
  cascadeOffset: 0,

  openWindow: (windowData) => {
    const { windows, highestZIndex, cascadeOffset } = get()
    
    // Calculate cascade position (Windows XP style)
    const currentSlot = cascadeOffset % CASCADE_MAX
    const cascadeX = CASCADE_START_X + (currentSlot * CASCADE_STEP)
    const cascadeY = CASCADE_START_Y + (currentSlot * CASCADE_STEP)
    
    // Generate unique ID for each instance
    const instanceId = `${windowData.id}-${Date.now()}`

    const newWindow: WindowState = {
      ...windowData,
      id: instanceId,
      x: cascadeX,
      y: cascadeY,
      zIndex: highestZIndex + 1,
      isMinimized: false,
      isMaximized: false,
    }

    set({
      windows: [...windows, newWindow],
      activeWindowId: newWindow.id,
      highestZIndex: highestZIndex + 1,
      cascadeOffset: cascadeOffset + 1,
    })
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter(w => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }))
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }))
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      ),
    }))
  },

  restoreWindow: (id) => {
    const { highestZIndex } = get()
    set((state) => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, isMinimized: false, zIndex: highestZIndex + 1 } : w
      ),
      activeWindowId: id,
      highestZIndex: highestZIndex + 1,
    }))
  },

  focusWindow: (id) => {
    const { highestZIndex } = get()
    set((state) => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, zIndex: highestZIndex + 1 } : w
      ),
      activeWindowId: id,
      highestZIndex: highestZIndex + 1,
    }))
  },

  updateWindowPosition: (id, x, y) => {
    set((state) => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, x, y } : w
      ),
    }))
  },

  updateWindowSize: (id, width, height) => {
    set((state) => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, width, height } : w
      ),
    }))
  },
}))
