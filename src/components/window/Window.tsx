'use client'

import { useRef, useState, useEffect } from 'react'
import { useWindowStore, WindowState } from '@/stores/windowStore'
import { useChaosStore } from '@/stores/chaosStore'

interface WindowProps {
  window: WindowState
  children: React.ReactNode
}

const chaosApps = ['minesweeper', 'snake', 'paint', 'notepad', 'ca', 'socials', 'recycle', 'chart']

export function Window({ window: win, children }: WindowProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, openWindow, activeWindowId } = useWindowStore()
  const { incrementClicks, showClippy } = useChaosStore()
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [windowStart, setWindowStart] = useState({ x: 0, y: 0 })
  const [closeAttempts, setCloseAttempts] = useState(0)
  
  const isActive = activeWindowId === win.id

  if (win.isMinimized) return null

  const handleMouseDown = (e: React.MouseEvent) => {
    if (win.isMaximized) return
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setWindowStart({ x: win.x, y: win.y })
    focusWindow(win.id)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    updateWindowPosition(win.id, windowStart.x + deltaX, windowStart.y + deltaY)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart, windowStart])

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    incrementClicks()
    setCloseAttempts(prev => prev + 1)

    // First 2 attempts: spawn MORE windows instead of closing
    if (closeAttempts < 2) {
      // Spawn 1-3 random windows
      const numNewWindows = Math.floor(Math.random() * 3) + 1
      for (let i = 0; i < numNewWindows; i++) {
        const randomApp = chaosApps[Math.floor(Math.random() * chaosApps.length)]
        openWindow({
          id: randomApp + '-' + Date.now() + '-' + i,
          title: `Oops! More windows!`,
          icon: '😈',
          component: randomApp,
          x: 50 + Math.random() * 400,
          y: 50 + Math.random() * 200,
          width: 400,
          height: 350,
        })
      }
      
      if (closeAttempts === 0) {
        showClippy("Did you mean to open MORE windows? Because that's what happened!")
      }
      return
    }

    // 3rd attempt: window dodges the cursor
    if (closeAttempts === 2) {
      updateWindowPosition(win.id, Math.random() * 500, Math.random() * 300)
      showClippy("Ha! The window moved. Try to catch it!")
      return
    }

    // 4th+ attempt: actually close (maybe)
    if (Math.random() < 0.7) {
      closeWindow(win.id)
    } else {
      // Transform into a different window
      updateWindowPosition(win.id, win.x + 20, win.y + 20)
      showClippy("Close button machine broke.")
    }
  }

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation()
    incrementClicks()
    
    // 30% chance to maximize instead
    if (Math.random() < 0.3) {
      maximizeWindow(win.id)
    } else {
      minimizeWindow(win.id)
    }
  }

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation()
    incrementClicks()
    
    // 30% chance to minimize instead
    if (Math.random() < 0.3) {
      minimizeWindow(win.id)
    } else {
      maximizeWindow(win.id)
    }
  }

  return (
    <div
      className="absolute transition-all duration-150"
      style={{
        zIndex: win.zIndex,
        left: win.isMaximized ? 0 : win.x,
        top: win.isMaximized ? 0 : win.y,
        width: win.isMaximized ? '100%' : win.width,
        height: win.isMaximized ? 'calc(100% - 40px)' : win.height,
      }}
      onMouseDown={() => focusWindow(win.id)}
    >
      <div className={`
        flex flex-col h-full
        bg-[#ece9d8] 
        border-t-[3px] border-l-[3px] border-[#fff]
        border-r-[3px] border-b-[3px] border-r-[#848484] border-b-[#848484]
        shadow-xl
        ${isActive ? '' : 'opacity-95'}
      `}>
        {/* Title Bar */}
        <div
          className={`
            flex items-center justify-between px-1 py-0.5 select-none
            ${win.isMaximized ? 'cursor-default' : 'cursor-move'}
            ${isActive 
              ? 'bg-gradient-to-r from-[#0a246a] via-[#0a246a] to-[#a6caf0]' 
              : 'bg-gradient-to-r from-[#7a96df] via-[#7a96df] to-[#a6caf0]'
            }
          `}
          onMouseDown={handleMouseDown}
          onDoubleClick={() => {
            incrementClicks()
            // Double click might do something random
            if (Math.random() < 0.3) {
              minimizeWindow(win.id)
            } else {
              maximizeWindow(win.id)
            }
          }}
        >
          <div className="flex items-center gap-1">
            <span className="text-sm">{win.icon}</span>
            <span className="text-white text-sm font-bold truncate max-w-[200px]">
              {win.title}
            </span>
          </div>
          
          {/* Window Controls */}
          <div className="flex gap-0.5">
            <button
              onClick={handleMinimize}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-5 h-5 bg-gradient-to-b from-[#fff] to-[#c4c4c4] border border-[#0a246a] rounded-sm flex items-center justify-center text-black text-xs font-bold hover:from-[#e8f4ff] hover:to-[#b0d0ff]"
              title="Minimize (or not)"
            >
              _
            </button>
            <button
              onClick={handleMaximize}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-5 h-5 bg-gradient-to-b from-[#fff] to-[#c4c4c4] border border-[#0a246a] rounded-sm flex items-center justify-center text-black text-xs font-bold hover:from-[#e8f4ff] hover:to-[#b0d0ff]"
              title="Maximize (probably)"
            >
              □
            </button>
            <button
              onClick={handleClose}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-5 h-5 bg-gradient-to-b from-[#c75050] to-[#a03030] border border-[#0a246a] rounded-sm flex items-center justify-center text-white text-xs font-bold hover:from-[#e87070] hover:to-[#c05050]"
              title={`Close (attempt ${closeAttempts + 1})`}
            >
              ×
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-hidden bg-white">
          {children}
        </div>
      </div>
    </div>
  )
}
