import { create } from 'zustand'

interface ChaosState {
  bsodTriggered: boolean
  clippyVisible: boolean
  clippyMessage: string
  mouseInverted: boolean
  windowsDrifting: boolean
  totalClicks: number
  cursedMode: boolean
  
  triggerBSOD: () => void
  dismissBSOD: () => void
  showClippy: (message: string) => void
  hideClippy: () => void
  invertMouse: () => void
  startDrifting: () => void
  incrementClicks: () => void
  activateCursedMode: () => void
}

const clippyMessages = [
  "It looks like you're trying to make money. Would you like me to delete your wallet?",
  "I see you clicked something. That was a mistake.",
  "Did you know? 97% of memecoins go to zero. This one goes to negative zero.",
  "You seem lost. So is your investment.",
  "Would you like to enable 'Rug Pull Mode'? (It's already enabled)",
  "I noticed you're having fun. Let me fix that.",
  "This isn't financial advice. This isn't even a real computer.",
  "Error 404: Your profits not found",
  "Shall I send your seed phrase to everyone in your contacts?",
  "You've been clicking for a while. Touch grass.",
]

export const useChaosStore = create<ChaosState>((set, get) => ({
  bsodTriggered: false,
  clippyVisible: false,
  clippyMessage: '',
  mouseInverted: false,
  windowsDrifting: false,
  totalClicks: 0,
  cursedMode: false,

  triggerBSOD: () => set({ bsodTriggered: true }),
  dismissBSOD: () => set({ bsodTriggered: false }),
  
  showClippy: (message: string) => set({ clippyVisible: true, clippyMessage: message }),
  hideClippy: () => set({ clippyVisible: false }),
  
  invertMouse: () => set({ mouseInverted: true }),
  startDrifting: () => set({ windowsDrifting: true }),
  
  incrementClicks: () => {
    const clicks = get().totalClicks + 1
    set({ totalClicks: clicks })
    
    // Random chaos events based on clicks
    if (clicks === 5) {
      set({ clippyVisible: true, clippyMessage: clippyMessages[0] })
    }
    if (clicks === 15) {
      set({ mouseInverted: true })
    }
    if (clicks === 25) {
      set({ windowsDrifting: true })
    }
    if (clicks === 50) {
      set({ cursedMode: true })
    }
    if (clicks % 10 === 0 && clicks > 0) {
      const randomMsg = clippyMessages[Math.floor(Math.random() * clippyMessages.length)]
      set({ clippyVisible: true, clippyMessage: randomMsg })
    }
    if (Math.random() < 0.03 && clicks > 20) { // 3% chance of BSOD after 20 clicks
      set({ bsodTriggered: true })
    }
  },
  
  activateCursedMode: () => set({ cursedMode: true }),
}))
