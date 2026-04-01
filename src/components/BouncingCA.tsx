'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export function BouncingCA() {
  const containerRef = useRef<HTMLDivElement>(null)
  const caRef = useRef<HTMLDivElement>(null)
  
  // Position and velocity
  const posRef = useRef({ x: 100, y: 100 })
  const velRef = useRef({ x: 2.5, y: 1.8 })
  const [displayPos, setDisplayPos] = useState({ x: 100, y: 100 })
  
  // Button offset from CA
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 50 })
  
  // CA text - replace "Coming soon" with actual CA later
  const [caText] = useState('Coming soon')
  
  // DVD bounce colors
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff', '#ffff00', '#ff8800']
  const [colorIndex, setColorIndex] = useState(0)

  // Animation loop
  useEffect(() => {
    let animationFrame: number

    const animate = () => {
      const maxX = window.innerWidth - 280
      const maxY = window.innerHeight - 120
      
      // Update position
      posRef.current.x += velRef.current.x
      posRef.current.y += velRef.current.y
      
      // Bounce off walls
      if (posRef.current.x <= 0 || posRef.current.x >= maxX) {
        velRef.current.x = -velRef.current.x
        setColorIndex(prev => (prev + 1) % colors.length)
      }
      if (posRef.current.y <= 0 || posRef.current.y >= maxY - 40) {
        velRef.current.y = -velRef.current.y
        setColorIndex(prev => (prev + 1) % colors.length)
      }
      
      // Clamp
      posRef.current.x = Math.max(0, Math.min(posRef.current.x, maxX))
      posRef.current.y = Math.max(0, Math.min(posRef.current.y, maxY - 40))
      
      setDisplayPos({ x: posRef.current.x, y: posRef.current.y })
      
      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [colors.length])

  // Handle mouse proximity to button - make it evade
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const buttonX = posRef.current.x + 140 + buttonOffset.x
    const buttonY = posRef.current.y + 60 + buttonOffset.y
    
    const dx = e.clientX - buttonX
    const dy = e.clientY - buttonY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // If mouse is within 100px, evade!
    if (distance < 100) {
      const angle = Math.atan2(dy, dx)
      const evadeDistance = 80
      
      setButtonOffset(prev => ({
        x: Math.max(-80, Math.min(80, prev.x - Math.cos(angle) * evadeDistance)),
        y: Math.max(40, Math.min(90, prev.y - Math.sin(angle) * evadeDistance))
      }))
    }
  }, [buttonOffset])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // Slowly return button to center when not evading
  useEffect(() => {
    const interval = setInterval(() => {
      setButtonOffset(prev => ({
        x: prev.x * 0.95,
        y: 50 + (prev.y - 50) * 0.95
      }))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    >
      <div
        ref={caRef}
        className="absolute transition-colors duration-300 select-none"
        style={{
          left: displayPos.x,
          top: displayPos.y,
          color: colors[colorIndex],
          textShadow: `0 0 20px ${colors[colorIndex]}, 0 0 40px ${colors[colorIndex]}40`,
        }}
      >
        <div className="text-center">
          <div className="text-xs opacity-60 mb-1">CA:</div>
          <div className="text-4xl font-bold tracking-wider">
            {caText}
          </div>
        </div>
        
        {/* Click to copy button that evades */}
        <button
          className="absolute text-xs text-gray-400 hover:text-white transition-all duration-75 whitespace-nowrap pointer-events-auto cursor-pointer"
          style={{
            left: `calc(50% + ${buttonOffset.x}px)`,
            top: buttonOffset.y,
            transform: 'translateX(-50%)',
            textShadow: '0 0 10px rgba(0,0,0,0.8)',
          }}
          onClick={() => {
            navigator.clipboard.writeText("Nice try! Happy April Fools! 🤡")
          }}
        >
          [ click to copy ]
        </button>
      </div>
    </div>
  )
}
