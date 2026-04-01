'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useChaosStore } from '@/stores/chaosStore'

const GRID_SIZE = 15
const CELL_SIZE = 20

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Position = { x: number; y: number }

export function ChaosSnake() {
  const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }])
  const [food, setFood] = useState<Position>({ x: 10, y: 10 })
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [invertedControls, setInvertedControls] = useState(true) // Start inverted!
  const [chaosMessage, setChaosMessage] = useState('')
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const { incrementClicks } = useChaosStore()

  const chaosMessages = [
    "Wait, which way is up again?",
    "Controls feel weird? That's a feature.",
    "Your reflexes seem slow today.",
    "The snake is judging your gameplay.",
    "Have you tried turning it off and never on again?",
  ]

  const generateFood = useCallback((): Position => {
    // Sometimes generate food INSIDE the snake (impossible to get)
    if (Math.random() < 0.2 && snake.length > 3) {
      return snake[Math.floor(Math.random() * snake.length)]
    }
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  }, [snake])

  const moveSnake = useCallback(() => {
    if (gameOver) return

    setSnake(currentSnake => {
      const head = currentSnake[0]
      let newHead: Position

      // Sometimes randomly change direction
      let actualDirection = direction
      if (Math.random() < 0.1) {
        const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT']
        actualDirection = directions[Math.floor(Math.random() * directions.length)]
      }

      switch (actualDirection) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 }
          break
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 }
          break
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y }
          break
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y }
          break
      }

      // Check wall collision (but sometimes walls don't exist)
      if (Math.random() > 0.1) { // 90% of the time walls work
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true)
          setChaosMessage("You hit a wall! Or did the wall hit you?")
          return currentSnake
        }
      } else {
        // Wrap around
        newHead.x = (newHead.x + GRID_SIZE) % GRID_SIZE
        newHead.y = (newHead.y + GRID_SIZE) % GRID_SIZE
      }

      // Check self collision (sometimes forgive it)
      const selfCollision = currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      if (selfCollision && Math.random() > 0.3) { // 70% of the time it kills you
        setGameOver(true)
        setChaosMessage("You ate yourself. Introspection is painful.")
        return currentSnake
      }

      const newSnake = [newHead, ...currentSnake]

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        // Sometimes subtract score instead of adding
        if (Math.random() < 0.2) {
          setScore(s => Math.max(0, s - 5))
          setChaosMessage("-5 points! April Fools!")
        } else {
          setScore(s => s + 10)
        }
        setFood(generateFood())
        
        // Random chaos events on eating
        if (Math.random() < 0.3) {
          setInvertedControls(inv => !inv)
          setChaosMessage(invertedControls ? "Controls normalized! JK they're still weird." : "Controls inverted! Good luck!")
        }
        
        return newSnake
      }

      return newSnake.slice(0, -1)
    })
  }, [direction, food, gameOver, generateFood, invertedControls])

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, 150)
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [moveSnake])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      incrementClicks()
      
      // INVERTED controls (up = down, etc.)
      const keyMap: Record<string, Direction> = invertedControls
        ? { ArrowUp: 'DOWN', ArrowDown: 'UP', ArrowLeft: 'RIGHT', ArrowRight: 'LEFT', w: 'DOWN', s: 'UP', a: 'RIGHT', d: 'LEFT' }
        : { ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT', w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT' }
      
      const newDirection = keyMap[e.key]
      if (newDirection) {
        e.preventDefault()
        setDirection(newDirection)
        
        // Show random chaos message occasionally
        if (Math.random() < 0.2) {
          setChaosMessage(chaosMessages[Math.floor(Math.random() * chaosMessages.length)])
          setTimeout(() => setChaosMessage(''), 2000)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [invertedControls, incrementClicks])

  const restartGame = () => {
    setSnake([{ x: 7, y: 7 }])
    setDirection('RIGHT')
    setGameOver(false)
    setScore(Math.floor(Math.random() * -20)) // Start with negative score lol
    setFood(generateFood())
    setChaosMessage("Here we go again...")
  }

  return (
    <div className="flex flex-col items-center p-4 bg-[#c0c0c0] h-full font-['MS_Sans_Serif',Tahoma,sans-serif]">
      <div className="flex justify-between w-full mb-2 text-sm">
        <span>Score: {score}</span>
        <span className={invertedControls ? 'text-red-600' : 'text-green-600'}>
          Controls: {invertedControls ? '~ INVERTED' : 'OK Normal (unlikely)'}
        </span>
      </div>
      
      {chaosMessage && (
        <div className="text-red-600 text-xs mb-2 animate-pulse">{chaosMessage}</div>
      )}

      <div 
        className="border-4 border-t-gray-600 border-l-gray-600 border-b-white border-r-white bg-black relative"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute ${index === 0 ? 'bg-lime-400' : 'bg-lime-600'} border border-lime-800`}
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              // Sometimes make segments invisible
              opacity: Math.random() < 0.05 ? 0.3 : 1,
            }}
          />
        ))}
        
        {/* Food */}
        <div
          className="absolute bg-red-500 rounded-full animate-pulse"
          style={{
            left: food.x * CELL_SIZE + 2,
            top: food.y * CELL_SIZE + 2,
            width: CELL_SIZE - 4,
            height: CELL_SIZE - 4,
            // Sometimes hide the food
            opacity: Math.random() < 0.1 ? 0 : 1,
          }}
        />

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
            <p className="text-red-500 text-xl mb-2">GAME OVER</p>
            <p className="text-white text-sm mb-4">Final Score: {score} {score < 0 ? '(lmao)' : ''}</p>
            <button
              onClick={restartGame}
              className="px-4 py-2 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600"
            >
              Try Again (it won't help)
            </button>
          </div>
        )}
      </div>

      <p className="text-xs mt-2 text-gray-600">Use arrow keys or WASD to move</p>
      <p className="text-xs text-red-600">(Controls may or may not be inverted)</p>
    </div>
  )
}
