'use client'

import { useState, useEffect, useRef } from 'react'
import { useChaosStore } from '@/stores/chaosStore'

export function FakeChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [price, setPrice] = useState(0.00042069)
  const [change, setChange] = useState(-69.42)
  const [mcap, setMcap] = useState(420690)
  const [message, setMessage] = useState('')
  const { incrementClicks } = useChaosStore()
  
  const priceHistory = useRef<number[]>([])

  useEffect(() => {
    // Initialize history
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
      
      // MCap also decreases
      setMcap(prev => Math.max(1, prev - Math.random() * 1000))
      
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
    
    // Add some chaos - random text
    if (Math.random() < 0.1) {
      ctx.font = '20px Arial'
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'
      const texts = ['RUG', 'NGMI', 'RIP', 'F', 'GG', '$FOOL']
      ctx.fillText(texts[Math.floor(Math.random() * texts.length)], Math.random() * width, Math.random() * height)
    }
  }

  const handleBuy = () => {
    incrementClicks()
    setMessage("Buy button failed: Your wallet said no.")
    setTimeout(() => setMessage(''), 3000)
  }

  const handleSell = () => {
    incrementClicks()
    setMessage("Sell successful! You got $0.00 back.")
    setPrice(prev => Math.max(0.00000001, prev * 0.5))
    setTimeout(() => setMessage(''), 3000)
  }

  const handleRefresh = () => {
    incrementClicks()
    // Make the price worse on refresh
    setPrice(prev => Math.max(0.00000001, prev * 0.5))
    setMcap(prev => Math.max(1, prev * 0.5))
    setChange(prev => prev - 10)
    setMessage("Refreshed! Price is now worse. You're welcome.")
    setTimeout(() => setMessage(''), 2000)
  }

  const formatPrice = (p: number) => {
    if (p < 0.0001) return p.toExponential(4)
    return p.toFixed(8)
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white font-['MS_Sans_Serif',Tahoma,sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🤡</span>
          <div>
            <h2 className="text-lg font-bold">$FOOL / USD</h2>
            <p className="text-xs text-gray-500">foolcoin • DexScreener</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-mono">${formatPrice(price)}</p>
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
          <p className="text-gray-500">Market Cap</p>
          <p className="text-white">${Math.floor(mcap).toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">24h Volume</p>
          <p className="text-red-500">$69 (real)</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Holders</p>
          <p>Just you</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Liquidity</p>
          <p className="text-red-500">Gone</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 p-2 border-t border-gray-800">
        <button
          onClick={handleBuy}
          className="flex-1 py-2 bg-green-600 hover:bg-green-700 font-bold rounded"
        >
          Buy (Broken)
        </button>
        <button
          onClick={handleSell}
          className="flex-1 py-2 bg-red-600 hover:bg-red-700 font-bold rounded"
        >
          Sell (Works)
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
        <span className="text-yellow-500">[!] This chart only goes down. That's the $FOOL promise.</span>
      </div>
    </div>
  )
}
