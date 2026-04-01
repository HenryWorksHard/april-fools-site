'use client'

import { useEffect, useState } from 'react'
import { useWindowStore } from '@/stores/windowStore'
import { useAppStore } from '@/stores/appStore'
import { useChaosStore } from '@/stores/chaosStore'
import { StartMenu } from '../start-menu/StartMenu'

export function Taskbar() {
  const { windows, activeWindowId, focusWindow, restoreWindow, minimizeWindow } = useWindowStore()
  const { startMenuOpen, setStartMenuOpen } = useAppStore()
  const { incrementClicks } = useChaosStore()
  const [time, setTime] = useState('')
  const [fakeNotifications, setFakeNotifications] = useState<string[]>([])

  useEffect(() => {
    const updateTime = () => {
      // Show wrong time (random offset)
      const now = new Date()
      const offset = Math.floor(Math.random() * 12) - 6 // -6 to +6 hours
      now.setHours(now.getHours() + offset)
      
      // Sometimes show completely wrong format
      if (Math.random() < 0.2) {
        setTime('??:?? AM')
      } else if (Math.random() < 0.1) {
        setTime('69:42 PM')
      } else {
        setTime(now.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }))
      }
    }
    updateTime()
    const interval = setInterval(updateTime, 3000) // Update every 3s for chaos
    return () => clearInterval(interval)
  }, [])

  // Random fake notifications
  useEffect(() => {
    const notifications = [
      "🚨 Wallet drained!",
      "📈 +9999% gains (jk)",
      "💀 Dev rugged",
      "🔔 Clippy misses you",
      "⚠️ Trust issues",
      "🎉 April Fools!",
    ]
    
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        const notif = notifications[Math.floor(Math.random() * notifications.length)]
        setFakeNotifications(prev => [...prev, notif])
        setTimeout(() => {
          setFakeNotifications(prev => prev.slice(1))
        }, 3000)
      }
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const handleTaskClick = (winId: string, isMinimized: boolean) => {
    incrementClicks()
    
    // 20% chance to do the opposite of what's expected
    if (Math.random() < 0.2) {
      if (isMinimized) {
        // Already minimized, keep it that way
      } else {
        minimizeWindow(winId)
      }
      return
    }
    
    if (isMinimized) {
      restoreWindow(winId)
    } else if (activeWindowId === winId) {
      minimizeWindow(winId)
    } else {
      focusWindow(winId)
    }
  }

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    incrementClicks()
    setStartMenuOpen(!startMenuOpen)
  }

  return (
    <>
      {startMenuOpen && <StartMenu />}
      
      {/* Fake notifications */}
      <div className="absolute bottom-[44px] right-4 flex flex-col gap-2 z-[999]">
        {fakeNotifications.map((notif, i) => (
          <div 
            key={i} 
            className="bg-yellow-100 border-2 border-yellow-500 px-3 py-2 rounded shadow-lg animate-bounce text-sm"
          >
            {notif}
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-[40px] bg-gradient-to-b from-[#245edb] via-[#3f8cf3] to-[#245edb] border-t-2 border-[#5fb3ff] flex items-center">
        {/* Start Button */}
        <button
          onClick={handleStartClick}
          className={`
            flex items-center gap-1 h-[34px] px-3 mx-1 rounded-r-lg
            bg-gradient-to-b from-[#5cb85c] to-[#3d8b3d]
            border border-[#fff]/30
            text-white font-bold text-sm
            hover:from-[#6cc86c] hover:to-[#4d9b4d]
            ${startMenuOpen ? 'from-[#4aa84a] to-[#2d7b2d]' : ''}
          `}
        >
          <span className="text-lg">🪟</span>
          <span>Start</span>
        </button>

        {/* Quick Launch Divider */}
        <div className="w-px h-[28px] bg-[#1c4db8] mx-1" />

        {/* Running Apps */}
        <div className="flex-1 flex items-center gap-1 px-1 overflow-hidden">
          {windows.map((win) => (
            <button
              key={win.id}
              onClick={() => handleTaskClick(win.id, win.isMinimized)}
              className={`
                flex items-center gap-1 h-[28px] px-2 min-w-[120px] max-w-[180px]
                text-white text-sm truncate
                border border-[#fff]/20 rounded
                ${activeWindowId === win.id && !win.isMinimized
                  ? 'bg-[#1c4db8] border-[#fff]/40'
                  : 'bg-[#3d7df5] hover:bg-[#4d8dff]'
                }
              `}
            >
              <span>{win.icon}</span>
              <span className="truncate">{win.title.split(' - ')[0]}</span>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-2 px-3 h-full bg-gradient-to-b from-[#0f8eff] to-[#0b6fcd] border-l border-[#fff]/20">
          <span className="text-white/80 text-sm cursor-pointer" title="Volume (muted forever)">🔇</span>
          <span className="text-white/80 text-sm cursor-pointer" title="No internet">📵</span>
          <span className="text-white text-sm font-medium cursor-pointer" title="Time is an illusion">{time}</span>
        </div>
      </div>
    </>
  )
}
