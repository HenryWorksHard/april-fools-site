'use client'

import { useRef, useState, useEffect } from 'react'
import { useChaosStore } from '@/stores/chaosStore'

const COLORS = ['#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff']

export function ChaosPaint() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })
  const [chaosMode, setChaosMode] = useState<'normal' | 'mirror' | 'random' | 'delayed'>('normal')
  const [delayedStrokes, setDelayedStrokes] = useState<Array<{x: number, y: number, color: string}>>([])
  const { incrementClicks } = useChaosStore()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Random chaos mode
    const modes: Array<'normal' | 'mirror' | 'random' | 'delayed'> = ['normal', 'mirror', 'random', 'delayed']
    setChaosMode(modes[Math.floor(Math.random() * modes.length)])
  }, [])

  // Process delayed strokes
  useEffect(() => {
    if (chaosMode !== 'delayed' || delayedStrokes.length === 0) return
    
    const timeout = setTimeout(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      const stroke = delayedStrokes[0]
      ctx.beginPath()
      ctx.arc(stroke.x, stroke.y, brushSize, 0, Math.PI * 2)
      ctx.fillStyle = stroke.color
      ctx.fill()
      
      setDelayedStrokes(prev => prev.slice(1))
    }, 500) // Half second delay
    
    return () => clearTimeout(timeout)
  }, [delayedStrokes, chaosMode, brushSize])

  const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)]

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const drawLine = (fromX: number, fromY: number, toX: number, toY: number, color: string) => {
      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)
      ctx.strokeStyle = color
      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'
      ctx.stroke()
    }

    let actualColor = selectedColor
    
    switch (chaosMode) {
      case 'mirror':
        // Draw mirrored on the other side
        drawLine(lastPos.x, lastPos.y, x, y, actualColor)
        drawLine(canvas.width - lastPos.x, lastPos.y, canvas.width - x, y, actualColor)
        break
        
      case 'random':
        // Random color every stroke
        actualColor = getRandomColor()
        drawLine(lastPos.x, lastPos.y, x, y, actualColor)
        // Also draw in a random nearby position
        const offsetX = (Math.random() - 0.5) * 50
        const offsetY = (Math.random() - 0.5) * 50
        drawLine(lastPos.x + offsetX, lastPos.y + offsetY, x + offsetX, y + offsetY, getRandomColor())
        break
        
      case 'delayed':
        // Store strokes to draw later
        setDelayedStrokes(prev => [...prev, { x, y, color: actualColor }])
        break
        
      default:
        // Normal... but sometimes draw in wrong place
        if (Math.random() < 0.1) {
          const wrongX = x + (Math.random() - 0.5) * 100
          const wrongY = y + (Math.random() - 0.5) * 100
          drawLine(lastPos.x, lastPos.y, wrongX, wrongY, actualColor)
        } else {
          drawLine(lastPos.x, lastPos.y, x, y, actualColor)
        }
    }

    setLastPos({ x, y })
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    incrementClicks()
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    setIsDrawing(true)
    setLastPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    incrementClicks()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // 30% chance to NOT clear (or clear with a color)
    if (Math.random() < 0.3) {
      ctx.fillStyle = getRandomColor()
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }

  const saveImage = () => {
    incrementClicks()
    const canvas = canvasRef.current
    if (!canvas) return
    
    // Instead of saving, show a troll message
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.font = '30px Comic Sans MS'
    ctx.fillStyle = 'red'
    ctx.fillText('APRIL FOOLS!', canvas.width / 2 - 100, canvas.height / 2)
    ctx.font = '16px Comic Sans MS'
    ctx.fillText('Your masterpiece has been deleted', canvas.width / 2 - 120, canvas.height / 2 + 30)
  }

  const getModeDescription = () => {
    switch (chaosMode) {
      case 'mirror': return '~ Mirror Mode (everything is doubled)'
      case 'random': return '[PAINT] Rainbow Mode (color roulette)'
      case 'delayed': return '[T] Lag Mode (500ms delay)'
      default: return '[P] Normal Mode (mostly)'
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-['MS_Sans_Serif',Tahoma,sans-serif]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-1 border-b border-gray-400">
        <button 
          onClick={clearCanvas}
          className="px-2 py-1 text-xs border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600"
        >
          Clear (maybe)
        </button>
        <button 
          onClick={saveImage}
          className="px-2 py-1 text-xs border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600"
        >
          Save
        </button>
        <span className="text-xs ml-2">{getModeDescription()}</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Tool palette */}
        <div className="w-12 bg-[#c0c0c0] p-1 border-r border-gray-400 flex flex-col gap-1">
          <div className="grid grid-cols-2 gap-0.5">
            {COLORS.map((color) => (
              <button
                key={color}
                className={`w-5 h-5 border ${selectedColor === color ? 'border-black border-2' : 'border-gray-600'}`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  incrementClicks()
                  // 20% chance to pick a different color
                  if (Math.random() < 0.2) {
                    setSelectedColor(getRandomColor())
                  } else {
                    setSelectedColor(color)
                  }
                }}
              />
            ))}
          </div>
          
          <div className="mt-2">
            <label className="text-xs">Size:</label>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-2 overflow-auto">
          <canvas
            ref={canvasRef}
            width={500}
            height={350}
            className="border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>

      {chaosMode === 'delayed' && delayedStrokes.length > 0 && (
        <div className="text-xs text-center p-1 bg-yellow-200">
          Pending strokes: {delayedStrokes.length} (please wait...)
        </div>
      )}
    </div>
  )
}
