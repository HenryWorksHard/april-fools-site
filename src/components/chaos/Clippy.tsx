'use client'

import { useState, useEffect } from 'react'

interface ClippyProps {
  message: string
  onDismiss: () => void
}

export function Clippy({ message, onDismiss }: ClippyProps) {
  const [position, setPosition] = useState({ x: 50, y: 200 })
  const [isShaking, setIsShaking] = useState(false)

  // Make Clippy dodge clicks
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsShaking(true)
    
    // Move to random position
    setPosition({
      x: Math.random() * (window.innerWidth - 250),
      y: Math.random() * (window.innerHeight - 300),
    })
    
    setTimeout(() => setIsShaking(false), 200)
    
    // Only 30% chance to actually dismiss
    if (Math.random() < 0.3) {
      onDismiss()
    }
  }

  // Random movement
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        setPosition(prev => ({
          x: Math.max(0, Math.min(window.innerWidth - 250, prev.x + (Math.random() - 0.5) * 100)),
          y: Math.max(0, Math.min(window.innerHeight - 300, prev.y + (Math.random() - 0.5) * 100)),
        }))
      }
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      className={`fixed z-[9000] transition-all duration-300 ${isShaking ? 'animate-shake' : ''}`}
      style={{ 
        left: position.x, 
        top: position.y,
      }}
      onClick={handleClick}
    >
      <div className="relative">
        {/* Speech bubble */}
        <div className="bg-[#ffffcc] border-2 border-black rounded-lg p-3 mb-2 max-w-[220px] shadow-lg">
          <p className="text-sm text-black font-['MS_Sans_Serif',Tahoma,sans-serif]">{message}</p>
          <div className="flex gap-2 mt-3">
            <button 
              className="px-3 py-1 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 text-xs active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white"
              onClick={handleClick}
            >
              Don't help me
            </button>
            <button 
              className="px-3 py-1 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 text-xs active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white"
              onClick={handleClick}
            >
              Go away
            </button>
          </div>
          {/* Bubble pointer */}
          <div className="absolute -bottom-2 left-8 w-4 h-4 bg-[#ffffcc] border-r-2 border-b-2 border-black transform rotate-45" />
        </div>
        
        {/* Clippy */}
        <div className="text-6xl cursor-pointer hover:scale-110 transition-transform select-none">
          [CLIP]
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-5deg); }
          75% { transform: translateX(5px) rotate(5deg); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out;
        }
      `}</style>
    </div>
  )
}
