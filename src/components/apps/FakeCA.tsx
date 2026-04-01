'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export function FakeCA() {
  const containerRef = useRef<HTMLDivElement>(null)
  const caRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  // CA position and velocity
  const [caPos, setCaPos] = useState({ x: 50, y: 50 })
  const [caVel, setCaVel] = useState({ x: 2, y: 1.5 })
  
  // Button follows CA but evades cursor
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 40 })
  const [isEvading, setIsEvading] = useState(false)
  
  // CA text (can be updated later)
  const [caText, setCaText] = useState('Coming soon')
  
  // DVD bounce colors
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff', '#ffff00', '#ff8800']
  const [colorIndex, setColorIndex] = useState(0)

  // Animate the bouncing CA
  useEffect(() => {
    const container = containerRef.current
    const ca = caRef.current
    if (!container || !ca) return

    let animationFrame: number
    let x = caPos.x
    let y = caPos.y
    let vx = caVel.x
    let vy = caVel.y

    const animate = () => {
      const containerRect = container.getBoundingClientRect()
      const caRect = ca.getBoundingClientRect()
      
      // Update position
      x += vx
      y += vy
      
      // Bounce off walls
      const maxX = containerRect.width - caRect.width
      const maxY = containerRect.height - caRect.height - 60 // Leave room for button
      
      if (x <= 0 || x >= maxX) {
        vx = -vx
        setColorIndex(prev => (prev + 1) % colors.length)
      }
      if (y <= 0 || y >= maxY) {
        vy = -vy
        setColorIndex(prev => (prev + 1) % colors.length)
      }
      
      // Clamp
      x = Math.max(0, Math.min(x, maxX))
      y = Math.max(0, Math.min(y, maxY))
      
      setCaPos({ x, y })
      setCaVel({ x: vx, y: vy })
      
      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, []) // Only run once

  // Handle mouse proximity to button - make it evade
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current
    const button = buttonRef.current
    if (!container || !button) return

    const containerRect = container.getBoundingClientRect()
    const buttonRect = button.getBoundingClientRect()
    
    const mouseX = e.clientX - containerRect.left
    const mouseY = e.clientY - containerRect.top
    
    const buttonCenterX = buttonRect.left - containerRect.left + buttonRect.width / 2
    const buttonCenterY = buttonRect.top - containerRect.top + buttonRect.height / 2
    
    const dx = mouseX - buttonCenterX
    const dy = mouseY - buttonCenterY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // If mouse is within 80px, evade!
    if (distance < 80) {
      setIsEvading(true)
      // Move away from cursor
      const angle = Math.atan2(dy, dx)
      const evadeDistance = 100
      const newOffsetX = buttonOffset.x - Math.cos(angle) * evadeDistance
      const newOffsetY = buttonOffset.y - Math.sin(angle) * evadeDistance
      
      // Clamp to stay within reasonable bounds
      setButtonOffset({
        x: Math.max(-100, Math.min(100, newOffsetX)),
        y: Math.max(30, Math.min(80, newOffsetY))
      })
    } else {
      setIsEvading(false)
    }
  }, [buttonOffset])

  // Reset button position periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isEvading) {
        setButtonOffset(prev => ({
          x: prev.x * 0.9, // Slowly return to center
          y: 40 + (prev.y - 40) * 0.9
        }))
      }
    }, 100)
    return () => clearInterval(interval)
  }, [isEvading])

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-black overflow-hidden cursor-default"
      onMouseMove={handleMouseMove}
    >
      {/* Bouncing CA */}
      <div
        ref={caRef}
        className="absolute transition-colors duration-300 select-none"
        style={{
          left: caPos.x,
          top: caPos.y,
          color: colors[colorIndex],
          textShadow: `0 0 10px ${colors[colorIndex]}`,
        }}
      >
        <div className="text-center">
          <div className="text-5xl font-bold tracking-wider">
            {caText}
          </div>
          <div className="text-xs mt-1 opacity-60">
            CA
          </div>
        </div>
        
        {/* Click to copy button that evades */}
        <button
          ref={buttonRef}
          className="absolute text-xs text-gray-400 hover:text-white transition-all duration-75 whitespace-nowrap"
          style={{
            left: `calc(50% + ${buttonOffset.x}px)`,
            top: buttonOffset.y,
            transform: 'translateX(-50%)',
          }}
          onClick={() => {
            // They'll never actually click this, but just in case
            navigator.clipboard.writeText("Nice try! There is no CA. Happy April Fools!")
          }}
        >
          [ click to copy ]
        </button>
      </div>

      {/* DVD logo in corner */}
      <div className="absolute bottom-2 right-2 text-gray-600 text-xs opacity-30">
        DVD
      </div>
    </div>
  )
}
