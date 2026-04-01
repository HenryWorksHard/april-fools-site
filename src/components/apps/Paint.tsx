'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

const COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
]

const TOOLS = [
  { id: 'pencil', icon: '✏️', label: 'Pencil' },
  { id: 'brush', icon: '🖌️', label: 'Brush' },
  { id: 'eraser', icon: '🧽', label: 'Eraser' },
  { id: 'fill', icon: '🪣', label: 'Fill' },
]

type Tool = 'pencil' | 'brush' | 'eraser' | 'fill'

export function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [tool, setTool] = useState<Tool>('pencil')
  const [brushSize, setBrushSize] = useState(3)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Fill with white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }, [])

  const draw = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    const size = tool === 'brush' ? brushSize * 2 : brushSize

    if (tool === 'eraser') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(x - size, y - size, size * 2, size * 2)
    } else {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()

      // Connect to last position for smooth lines
      if (lastPos.current) {
        ctx.strokeStyle = color
        ctx.lineWidth = size * 2
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(lastPos.current.x, lastPos.current.y)
        ctx.lineTo(x, y)
        ctx.stroke()
      }
    }

    lastPos.current = { x, y }
  }, [color, tool, brushSize])

  const floodFill = useCallback((startX: number, startY: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    
    const startIdx = (Math.floor(startY) * canvas.width + Math.floor(startX)) * 4
    const startR = data[startIdx]
    const startG = data[startIdx + 1]
    const startB = data[startIdx + 2]

    // Convert hex color to RGB
    const fillColor = {
      r: parseInt(color.slice(1, 3), 16),
      g: parseInt(color.slice(3, 5), 16),
      b: parseInt(color.slice(5, 7), 16),
    }

    // Don't fill if same color
    if (startR === fillColor.r && startG === fillColor.g && startB === fillColor.b) return

    const stack: [number, number][] = [[Math.floor(startX), Math.floor(startY)]]
    const visited = new Set<string>()

    while (stack.length > 0) {
      const [x, y] = stack.pop()!
      const key = `${x},${y}`
      
      if (visited.has(key)) continue
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue
      
      const idx = (y * canvas.width + x) * 4
      if (data[idx] !== startR || data[idx + 1] !== startG || data[idx + 2] !== startB) continue
      
      visited.add(key)
      
      data[idx] = fillColor.r
      data[idx + 1] = fillColor.g
      data[idx + 2] = fillColor.b
      data[idx + 3] = 255
      
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
      
      // Limit iterations to prevent freezing
      if (visited.size > 100000) break
    }

    ctx.putImageData(imageData, 0, 0)
  }, [color])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e)
    
    if (tool === 'fill') {
      floodFill(coords.x, coords.y)
    } else {
      setIsDrawing(true)
      lastPos.current = null
      draw(coords.x, coords.y)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === 'fill') return
    const coords = getCanvasCoords(e)
    draw(coords.x, coords.y)
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
    lastPos.current = null
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">
      {/* Menu Bar */}
      <div className="flex items-center bg-[#ece9d8] border-b border-[#848484] px-1 py-0.5 text-sm">
        <button className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white">File</button>
        <button className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white">Edit</button>
        <button className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white" onClick={clearCanvas}>Clear</button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Tool Palette */}
        <div className="w-12 bg-[#c0c0c0] border-r border-[#808080] p-1 flex flex-col gap-1">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id as Tool)}
              className={`
                w-10 h-10 flex items-center justify-center text-lg
                border-2 ${tool === t.id 
                  ? 'border-t-[#808080] border-l-[#808080] border-b-[#fff] border-r-[#fff] bg-[#c0c0c0]' 
                  : 'border-t-[#fff] border-l-[#fff] border-b-[#808080] border-r-[#808080]'
                }
              `}
              title={t.label}
            >
              {t.icon}
            </button>
          ))}
          
          <div className="mt-2 text-xs text-center">Size</div>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-10"
          />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-2 bg-[#808080]">
          <canvas
            ref={canvasRef}
            width={500}
            height={350}
            className="bg-white cursor-crosshair border-2 border-t-[#808080] border-l-[#808080] border-b-[#fff] border-r-[#fff]"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </div>

      {/* Color Palette */}
      <div className="flex items-center gap-1 p-1 bg-[#c0c0c0] border-t border-[#808080]">
        <div 
          className="w-8 h-8 border-2 border-[#808080]"
          style={{ backgroundColor: color }}
        />
        <div className="flex flex-wrap gap-0.5 ml-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-4 h-4 border ${color === c ? 'border-black border-2' : 'border-[#808080]'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
