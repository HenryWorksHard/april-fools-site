'use client'

import { useState, useEffect, useRef } from 'react'
import { useChaosStore } from '@/stores/chaosStore'

export function FakeChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [price, setPrice] = useState(0.00042069)
  const [change, setChange] = useState(-69.42)
  const [message, setMessage] = useState('')
  const { incrementClicks } = useChaosStore()
  
  const priceHistory = useRef<number[]>([])

  useEffect(() => {
    // Initialize price history
    for (let i = 0; i < 100; i++) {
      priceHistory.current.push(0.001 * Math.random())
    }
    
    // Animate the chart - always going down
    const interval = setInterval(() => {
      setPrice(prev => {
        // 80% chance to go down, 20% up (tiny bit)
        const direction = Math.random() < 0.8 ? -1 : 1
        const magnitude = Math.random() * 0.00001 * (direction === -1 ? 2 : 0.5)
        const newPrice = Math.max(0.00000001, prev + direction * magnitude)
        
        priceHistory.current.push(newPrice)
        if (priceHistory.current.length > 100) {
          priceHistory.current.shift()
        }
        
        return newPrice
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
    const prices = priceHistory.current
    if (prices.length < 2) return
    
    const maxPrice = Math.max(...prices) * 1.1
    const minPrice = Math.min(...prices) * 0.9
    const range = maxPrice - minPrice || 1
    
    ctx.beginPath()
    ctx.strokeStyle = '#ef4444' // Always red
    ctx.lineWidth = 2
    
    prices.forEach((p, i) => {
      const x = (i / prices.length) * width
      const y = height - ((p - minPrice) / range) * height
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
    
    // Add some chaos - random "RUG" text
    if (Math.random() < 0.1) {
      ctx.font = '20px Arial'
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'
      ctx.fillText('RUG', Math.random() * width, Math.random() * height)
    }
  }

  const handleBuy = () => {
    incrementClicks()
    setMessage("Buy order failed: Slippage 99999%. Try again? (Don't)")
    setTimeout(() => setMessage(''), 3000)
  }

  const handleSell = () => {
    incrementClicks()
    setMessage("Sell order failed: No liquidity found. You're stuck here forever.")
    setTimeout(() => setMessage(''), 3000)
  }

  const handleRefresh = () => {
    incrementClicks()
    // Make the price worse on refresh
    setPrice(prev => prev * 0.5)
    setChange(prev => prev - 10)
    setMessage("Refreshed! Price is now worse. You're welcome.")
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white font-['MS_Sans_Serif',Tahoma,sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <div>
          <h2 className="text-lg font-bold">$APRLFLS / USDC</h2>
          <p className="text-xs text-gray-500">April Fools Token</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-mono">${price.toFixed(10)}</p>
          <p className="text-red-500 text-sm">{change.toFixed(2)}% (24h)</p>
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
          <p className="text-gray-500">24h High</p>
          <p className="text-green-500">$0.01 (lol)</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">24h Low</p>
          <p className="text-red-500">$0.00 (soon)</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Volume</p>
          <p>$420.69</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Holders</p>
          <p>3 (all devs)</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 p-2 border-t border-gray-800">
        <button
          onClick={handleBuy}
          className="flex-1 py-2 bg-green-600 hover:bg-green-700 font-bold rounded"
        >
          Buy (Don't)
        </button>
        <button
          onClick={handleSell}
          className="flex-1 py-2 bg-red-600 hover:bg-red-700 font-bold rounded"
        >
          Sell (Can't)
        </button>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          🔄
        </button>
      </div>

      {/* Warning banner */}
      <div className="bg-yellow-900/50 border-t border-yellow-600 p-2 text-center text-xs">
        <span className="text-yellow-500">⚠️ DYOR: This chart only goes down. That's the feature.</span>
      </div>
    </div>
  )
}
