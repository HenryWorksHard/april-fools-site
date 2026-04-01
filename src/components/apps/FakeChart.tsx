'use client'

import { useState, useEffect, useRef } from 'react'
import { useChaosStore } from '@/stores/chaosStore'

export function FakeChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(42069)
  const [change, setChange] = useState(-69.42)
  const [message, setMessage] = useState('')
  const { incrementClicks } = useChaosStore()
  
  const priceHistory = useRef<number[]>([])

  useEffect(() => {
    // Initialize history
    for (let i = 0; i < 100; i++) {
      priceHistory.current.push(50000 * Math.random())
    }
    
    // Animate the chart - always going down
    const interval = setInterval(() => {
      setScore(prev => {
        // 80% chance to go down, 20% up (tiny bit)
        const direction = Math.random() < 0.8 ? -1 : 1
        const magnitude = Math.random() * 100 * (direction === -1 ? 2 : 0.5)
        const newScore = Math.max(1, prev + direction * magnitude)
        
        priceHistory.current.push(newScore)
        if (priceHistory.current.length > 100) {
          priceHistory.current.shift()
        }
        
        return Math.floor(newScore)
      })
      
      // Change always gets worse
      setChange(prev => Math.min(-99.99, prev - Math.random() * 0.5))
      
      drawChart()
    }, 500)
    
    return () => clearInterval(interval)
  }, [])

  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const width = canvas.width
    const height = canvas.height
    
    // Clear
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, width, height)
    
    // Grid lines
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 1
    for (let i = 0; i < 5; i++) {
      const y = (height / 5) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
    
    // Draw the line (always going down)
    const scores = priceHistory.current
    if (scores.length < 2) return
    
    const maxScore = Math.max(...scores) * 1.1
    const minScore = Math.min(...scores) * 0.9
    const range = maxScore - minScore || 1
    
    ctx.beginPath()
    ctx.strokeStyle = '#ef4444' // Always red
    ctx.lineWidth = 2
    
    scores.forEach((p, i) => {
      const x = (i / scores.length) * width
      const y = height - ((p - minScore) / range) * height
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
    
    // Fill under the line
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)'
    ctx.fill()
    
    // Add some chaos - random "LOL" text
    if (Math.random() < 0.1) {
      ctx.font = '20px Arial'
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'
      const texts = ['LOL', 'NOPE', 'RIP', 'F', 'OOF']
      ctx.fillText(texts[Math.floor(Math.random() * texts.length)], Math.random() * width, Math.random() * height)
    }
  }

  const handleUp = () => {
    incrementClicks()
    setMessage("Up button failed: That feature doesn't exist here.")
    setTimeout(() => setMessage(''), 3000)
  }

  const handleDown = () => {
    incrementClicks()
    setMessage("Down button worked! Wait, that's bad.")
    setScore(prev => Math.max(1, prev - 1000))
    setTimeout(() => setMessage(''), 3000)
  }

  const handleRefresh = () => {
    incrementClicks()
    // Make the score worse on refresh
    setScore(prev => Math.max(1, Math.floor(prev * 0.5)))
    setChange(prev => prev - 10)
    setMessage("Refreshed! Score is now worse. You're welcome.")
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white font-['MS_Sans_Serif',Tahoma,sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <div>
          <h2 className="text-lg font-bold">Happiness Index</h2>
          <p className="text-xs text-gray-500">Your Current Mood</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-mono">{score.toLocaleString()} pts</p>
          <p className="text-red-500 text-sm">{change.toFixed(2)}% (today)</p>
        </div>
      </div>

      {message && (
        <div className="bg-red-900/50 border border-red-500 p-2 text-xs text-center">
          {message}
        </div>
      )}

      {/* Chart */}
      <div className="flex-1 p-2">
        <canvas 
          ref={canvasRef} 
          width={650} 
          height={300}
          className="w-full h-full"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 p-2 border-t border-gray-800 text-xs">
        <div className="text-center">
          <p className="text-gray-500">Daily High</p>
          <p className="text-green-500">100,000 (lol)</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Daily Low</p>
          <p className="text-red-500">0 (soon)</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Clicks</p>
          <p>Too many</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Users</p>
          <p>Just you</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 p-2 border-t border-gray-800">
        <button
          onClick={handleUp}
          className="flex-1 py-2 bg-green-600 hover:bg-green-700 font-bold rounded"
        >
          Go Up (Broken)
        </button>
        <button
          onClick={handleDown}
          className="flex-1 py-2 bg-red-600 hover:bg-red-700 font-bold rounded"
        >
          Go Down (Works)
        </button>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          ~
        </button>
      </div>

      {/* Warning banner */}
      <div className="bg-yellow-900/50 border-t border-yellow-600 p-2 text-center text-xs">
        <span className="text-yellow-500">[!] Notice: This chart only goes down. That's the feature, not a bug.</span>
      </div>
    </div>
  )
}
