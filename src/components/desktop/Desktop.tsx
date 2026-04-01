'use client'

import { useState, useEffect, useCallback } from 'react'
import { DesktopIcon } from './DesktopIcon'
import { Taskbar } from '../taskbar/Taskbar'
import { Window } from '../window/Window'
import { useWindowStore } from '@/stores/windowStore'
import { useAppStore } from '@/stores/appStore'
import { useChaosStore } from '@/stores/chaosStore'
import { BSOD } from '../chaos/BSOD'
import { Clippy } from '../chaos/Clippy'
import { ChaosSnake } from '../apps/ChaosSnake'
import { ChaosMinesweeper } from '../apps/ChaosMinesweeper'
import { ChaosPaint } from '../apps/ChaosPaint'
import { ChaosNotepad } from '../apps/ChaosNotepad'
import { FakeCA } from '../apps/FakeCA'
import { FakeSocials } from '../apps/FakeSocials'
import { ChaosRecycleBin } from '../apps/ChaosRecycleBin'
import { FakeChart } from '../apps/FakeChart'

// What you THINK you're clicking vs what actually opens
const chaosMapping: Record<string, string> = {
  'ca': 'paint',           // CA opens Paint
  'manifesto': 'snake',     // Manifesto opens Snake
  'games': 'notepad',       // Games opens Notepad
  'chart': 'recycle',       // Chart opens Recycle Bin
  'gallery': 'ca',          // Gallery opens fake CA
  'readme': 'minesweeper',  // README opens Minesweeper
  'recycle': 'socials',     // Recycle Bin opens Socials
  'socials': 'chart',       // Socials opens Chart
  'minesweeper': 'manifesto',
  'snake': 'games',
  'paint': 'readme',
}

const desktopIcons = [
  { id: 'ca', icon: '🤡', label: 'foolcoin.exe' },
  { id: 'manifesto', icon: '📜', label: 'manifesto.exe' },
  { id: 'games', icon: '🎮', label: 'games.exe' },
  { id: 'chart', icon: '📈', label: 'chart.exe' },
  { id: 'gallery', icon: '🖼️', label: 'gallery.exe' },
  { id: 'readme', icon: '📝', label: 'README.txt' },
  { id: 'recycle', icon: '🗑️', label: 'Recycle Bin' },
  { id: 'socials', icon: '💬', label: 'socials.exe' },
]

const appConfigs: Record<string, { title: string; icon: string; width: number; height: number }> = {
  ca: { title: 'foolcoin - Contract Address', icon: '🤡', width: 450, height: 400 },
  manifesto: { title: 'manifesto.exe - Notepad', icon: '📜', width: 500, height: 400 },
  readme: { title: 'README.txt - Notepad', icon: '📝', width: 450, height: 350 },
  games: { title: 'Games Menu', icon: '🎮', width: 300, height: 250 },
  minesweeper: { title: 'Minesweeper', icon: '💣', width: 320, height: 420 },
  snake: { title: 'Snake', icon: '🐍', width: 420, height: 480 },
  paint: { title: 'Paint', icon: '🎨', width: 600, height: 500 },
  chart: { title: 'foolcoin - DexScreener', icon: '📈', width: 700, height: 500 },
  socials: { title: 'foolcoin.lol', icon: '💬', width: 350, height: 320 },
  gallery: { title: 'Gallery', icon: '🖼️', width: 600, height: 550 },
  recycle: { title: 'Recycle Bin', icon: '🗑️', width: 500, height: 450 },
}

export function Desktop() {
  const { windows, openWindow } = useWindowStore()
  const { setStartMenuOpen } = useAppStore()
  const { bsodTriggered, clippyVisible, clippyMessage, mouseInverted, windowsDrifting, incrementClicks, hideClippy } = useChaosStore()
  const [iconPositions, setIconPositions] = useState<Record<string, { x: number; y: number }>>({})
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [fakeCursorPos, setFakeCursorPos] = useState({ x: 0, y: 0 })

  // Initialize random icon positions on mount
  useEffect(() => {
    const positions: Record<string, { x: number; y: number }> = {}
    desktopIcons.forEach((icon, index) => {
      positions[icon.id] = { x: 16, y: 16 + index * 90 }
    })
    setIconPositions(positions)
  }, [])

  // Handle mouse movement for inverted cursor
  useEffect(() => {
    if (!mouseInverted) return
    
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
      // Fake cursor goes opposite direction from center
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      setFakeCursorPos({
        x: centerX - (e.clientX - centerX) * 0.5,
        y: centerY - (e.clientY - centerY) * 0.5,
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseInverted])

  // Window drifting effect
  useEffect(() => {
    if (!windowsDrifting) return
    
    const interval = setInterval(() => {
      const windowStore = useWindowStore.getState()
      windowStore.windows.forEach(win => {
        windowStore.updateWindowPosition(
          win.id, 
          win.x + (Math.random() - 0.5) * 4,
          win.y + Math.random() * 3
        )
      })
    }, 100)
    
    return () => clearInterval(interval)
  }, [windowsDrifting])

  const shuffleIconPositions = useCallback(() => {
    const newPositions: Record<string, { x: number; y: number }> = {}
    const shuffledIndices = [...Array(desktopIcons.length).keys()].sort(() => Math.random() - 0.5)
    
    desktopIcons.forEach((icon, index) => {
      const newIndex = shuffledIndices[index]
      newPositions[icon.id] = { 
        x: 16 + Math.random() * 100, 
        y: 16 + newIndex * 90 + Math.random() * 20 
      }
    })
    setIconPositions(newPositions)
  }, [])

  const handleIconDoubleClick = (id: string) => {
    incrementClicks()
    incrementClicks() // Double click = 2 clicks
    
    // 30% chance to shuffle icons when clicking
    if (Math.random() < 0.3) {
      shuffleIconPositions()
    }

    // Get the WRONG app (chaos mapping)
    const actualApp = chaosMapping[id] || id
    const config = appConfigs[actualApp]
    if (!config) return

    openWindow({
      id: actualApp + '-' + Date.now(), // Unique ID
      title: config.title,
      icon: config.icon,
      component: actualApp,
      x: 100 + Math.random() * 300,
      y: 50 + Math.random() * 150,
      width: config.width,
      height: config.height,
    })
  }

  const renderWindowContent = (component: string) => {
    switch (component) {
      case 'ca':
        return <FakeCA />
      case 'manifesto':
      case 'readme':
        return <ChaosNotepad />
      case 'minesweeper':
        return <ChaosMinesweeper />
      case 'snake':
        return <ChaosSnake />
      case 'paint':
        return <ChaosPaint />
      case 'games':
        return <GamesMenu onOpenGame={(game) => handleIconDoubleClick(game)} />
      case 'recycle':
        return <ChaosRecycleBin />
      case 'socials':
        return <FakeSocials />
      case 'chart':
        return <FakeChart />
      default:
        return <div className="p-4 bg-[#c0c0c0] h-full font-['MS_Sans_Serif',Tahoma,sans-serif]">ERROR: File corrupted. Please try again (it won't help).</div>
    }
  }

  const handleDesktopClick = () => {
    incrementClicks()
    setStartMenuOpen(false)
  }

  if (bsodTriggered) {
    return <BSOD />
  }

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-cover bg-center select-none"
      style={{ 
        backgroundImage: "url('/images/bliss.jpg')",
        backgroundColor: '#3a6ea5',
        backgroundSize: 'cover',
        cursor: mouseInverted ? 'none' : 'default',
      }}
      onClick={handleDesktopClick}
    >
      {/* Desktop Icons */}
      {desktopIcons.map((item) => (
        <DesktopIcon
          key={item.id}
          icon={item.icon}
          label={item.label}
          style={{
            position: 'absolute',
            left: iconPositions[item.id]?.x || 16,
            top: iconPositions[item.id]?.y || 16,
            transition: 'all 0.3s ease',
          }}
          onDoubleClick={() => handleIconDoubleClick(item.id)}
        />
      ))}

      {/* Windows */}
      {windows.map((win) => (
        <Window key={win.id} window={win}>
          {renderWindowContent(win.component)}
        </Window>
      ))}

      {/* Clippy */}
      {clippyVisible && (
        <Clippy message={clippyMessage} onDismiss={hideClippy} />
      )}

      {/* Fake inverted cursor */}
      {mouseInverted && (
        <div 
          className="fixed pointer-events-none z-[9999]"
          style={{ 
            left: fakeCursorPos.x, 
            top: fakeCursorPos.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="text-3xl rotate-180">🖱️</div>
        </div>
      )}

      {/* Taskbar */}
      <Taskbar />
    </div>
  )
}

function GamesMenu({ onOpenGame }: { onOpenGame: (game: string) => void }) {
  const { incrementClicks } = useChaosStore()
  
  const handleClick = (game: string) => {
    incrementClicks()
    onOpenGame(game)
  }

  return (
    <div className="p-4 space-y-2 bg-[#c0c0c0] h-full font-['MS_Sans_Serif',Tahoma,sans-serif]">
      <p className="text-xs text-red-600 mb-2">Warning: Games may not work as expected</p>
      <button 
        onClick={() => handleClick('minesweeper')}
        className="flex items-center gap-2 w-full p-2 hover:bg-[#316ac5] hover:text-white border border-transparent hover:border-white"
      >
        <span>💣</span> Minesweeper (definitely safe)
      </button>
      <button 
        onClick={() => handleClick('snake')}
        className="flex items-center gap-2 w-full p-2 hover:bg-[#316ac5] hover:text-white border border-transparent hover:border-white"
      >
        <span>🐍</span> Snake (controls verified)
      </button>
      <button 
        onClick={() => handleClick('paint')}
        className="flex items-center gap-2 w-full p-2 hover:bg-[#316ac5] hover:text-white border border-transparent hover:border-white"
      >
        <span>🎨</span> Paint (100% functional)
      </button>
    </div>
  )
}
