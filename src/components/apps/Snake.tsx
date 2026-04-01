'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const GRID_SIZE = 20
const CELL_SIZE = 18
const INITIAL_SPEED = 150

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Position = { x: number; y: number }

export function Snake() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 10 })
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const directionRef = useRef(direction)

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
    } while (currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y))
    return newFood
  }, [])

  const resetGame = () => {
    const initialSnake = [{ x: 10, y: 10 }]
    setSnake(initialSnake)
    setFood(generateFood(initialSnake))
    setDirection('RIGHT')
    directionRef.current = 'RIGHT'
    setGameOver(false)
    setScore(0)
    setIsPlaying(true)
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isPlaying) return
    
    const currentDir = directionRef.current
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir !== 'DOWN') {
          setDirection('UP')
          directionRef.current = 'UP'
        }
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir !== 'UP') {
          setDirection('DOWN')
          directionRef.current = 'DOWN'
        }
        break
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir !== 'RIGHT') {
          setDirection('LEFT')
          directionRef.current = 'LEFT'
        }
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir !== 'LEFT') {
          setDirection('RIGHT')
          directionRef.current = 'RIGHT'
        }
        break
    }
  }, [isPlaying])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (!isPlaying || gameOver) return

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] }
        const currentDir = directionRef.current

        switch (currentDir) {
          case 'UP': head.y -= 1; break
          case 'DOWN': head.y += 1; break
          case 'LEFT': head.x -= 1; break
          case 'RIGHT': head.x += 1; break
        }

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true)
          setIsPlaying(false)
          return prevSnake
        }

        // Check self collision
        if (prevSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
          setGameOver(true)
          setIsPlaying(false)
          return prevSnake
        }

        const newSnake = [head, ...prevSnake]

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(prev => prev + 10)
          setFood(generateFood(newSnake))
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }

    const speed = Math.max(50, INITIAL_SPEED - score)
    const interval = setInterval(moveSnake, speed)
    return () => clearInterval(interval)
  }, [isPlaying, gameOver, food, score, generateFood])

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-[#c0c0c0] border-b-2 border-[#808080]">
        <div className="bg-black text-green-500 font-mono text-xl px-2 py-1 min-w-[60px] text-center">
          🐍 {score}
        </div>
        <button
          onClick={resetGame}
          className="text-2xl hover:scale-110 transition-transform"
        >
          {gameOver ? '😵' : isPlaying ? '🙂' : '🎮'}
        </button>
        <div className="bg-black text-green-500 font-mono text-xl px-2 py-1 min-w-[60px] text-center">
          $TRAD
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 flex items-center justify-center p-2">
        <div 
          className="relative border-2 border-[#808080] border-t-[#fff] border-l-[#fff] bg-black"
          style={{ 
            width: GRID_SIZE * CELL_SIZE, 
            height: GRID_SIZE * CELL_SIZE 
          }}
        >
          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className={`absolute ${index === 0 ? 'bg-green-400' : 'bg-green-600'} rounded-sm`}
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE - 1,
                height: CELL_SIZE - 1,
              }}
            />
          ))}

          {/* Food */}
          <div
            className="absolute text-center"
            style={{
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              fontSize: CELL_SIZE - 4,
              lineHeight: `${CELL_SIZE}px`,
            }}
          >
            🍎
          </div>

          {/* Start/Game Over overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-center">
                {gameOver ? (
                  <>
                    <div className="text-red-500 text-xl mb-2">GAME OVER</div>
                    <div className="text-white text-sm mb-4">Score: {score}</div>
                  </>
                ) : (
                  <div className="text-green-400 text-lg mb-4">🐍 SNAKE</div>
                )}
                <button
                  onClick={resetGame}
                  className="text-green-400 hover:text-green-300 text-sm animate-pulse"
                >
                  [ CLICK TO {gameOver ? 'RESTART' : 'START'} ]
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-center py-1 text-[#808080] bg-[#c0c0c0]">
        Arrow keys or WASD to move | Eat 🍎 to grow | Don't hit walls!
      </div>
    </div>
  )
}
