'use client'

import { useState, useEffect } from 'react'
import { useChaosStore } from '@/stores/chaosStore'

const GRID_ROWS = 9
const GRID_COLS = 9
const MINE_COUNT = 10

type CellState = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  adjacentMines: number
}

export function ChaosMinesweeper() {
  const [grid, setGrid] = useState<CellState[][]>([])
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [minesRemaining, setMinesRemaining] = useState(MINE_COUNT)
  const [firstClick, setFirstClick] = useState(true)
  const [chaosMessage, setChaosMessage] = useState('')
  const { incrementClicks, triggerBSOD } = useChaosStore()

  const initializeGrid = (safeRow?: number, safeCol?: number): CellState[][] => {
    const newGrid: CellState[][] = Array(GRID_ROWS).fill(null).map(() =>
      Array(GRID_COLS).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      }))
    )

    // Place mines randomly (but sometimes place MORE than expected)
    let actualMineCount = MINE_COUNT
    if (Math.random() < 0.3) {
      actualMineCount = MINE_COUNT + Math.floor(Math.random() * 10) // Up to 10 extra mines
      setChaosMessage(`Hmm, there seem to be more mines than usual...`)
    }

    let placedMines = 0
    while (placedMines < actualMineCount) {
      const row = Math.floor(Math.random() * GRID_ROWS)
      const col = Math.floor(Math.random() * GRID_COLS)
      
      // Skip safe zone around first click
      if (safeRow !== undefined && safeCol !== undefined) {
        if (Math.abs(row - safeRow) <= 1 && Math.abs(col - safeCol) <= 1) continue
      }
      
      if (!newGrid[row][col].isMine) {
        newGrid[row][col].isMine = true
        placedMines++
      }
    }

    // Calculate adjacent mines (but sometimes lie about the numbers)
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (newGrid[row][col].isMine) continue
        
        let count = 0
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const newRow = row + dr
            const newCol = col + dc
            if (newRow >= 0 && newRow < GRID_ROWS && newCol >= 0 && newCol < GRID_COLS) {
              if (newGrid[newRow][newCol].isMine) count++
            }
          }
        }
        
        // Sometimes show wrong number (25% chance)
        if (Math.random() < 0.25 && count > 0) {
          count = Math.max(0, count + (Math.random() < 0.5 ? 1 : -1))
        }
        
        newGrid[row][col].adjacentMines = count
      }
    }

    return newGrid
  }

  useEffect(() => {
    setGrid(initializeGrid())
  }, [])

  const revealCell = (row: number, col: number) => {
    if (gameOver || won || grid[row]?.[col]?.isRevealed || grid[row]?.[col]?.isFlagged) return
    
    incrementClicks()
    
    // First click initializes with safe zone
    if (firstClick) {
      const newGrid = initializeGrid(row, col)
      setGrid(newGrid)
      setFirstClick(false)
      
      // But wait... 10% chance to still hit a mine on first click anyway
      if (Math.random() < 0.1) {
        newGrid[row][col].isMine = true
        setChaosMessage("Unlucky! The mine moved under your click.")
      }
      
      revealCellRecursive(newGrid, row, col)
      setGrid([...newGrid])
      return
    }

    const newGrid = [...grid.map(r => [...r])]
    
    // Check for mine
    if (newGrid[row][col].isMine) {
      // 20% chance mine doesn't explode (fake safe)
      if (Math.random() < 0.2) {
        setChaosMessage("The mine... didn't explode? Lucky you!")
        newGrid[row][col].isMine = false
        newGrid[row][col].isRevealed = true
      } else {
        setGameOver(true)
        // Reveal all mines
        newGrid.forEach(row => row.forEach(cell => {
          if (cell.isMine) cell.isRevealed = true
        }))
        // Small chance of BSOD on game over
        if (Math.random() < 0.15) {
          setTimeout(triggerBSOD, 500)
        }
      }
      setGrid(newGrid)
      return
    }

    revealCellRecursive(newGrid, row, col)
    setGrid(newGrid)
    
    // Check win condition (but sometimes say you won when you didn't)
    checkWin(newGrid)
  }

  const revealCellRecursive = (grid: CellState[][], row: number, col: number) => {
    if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) return
    if (grid[row][col].isRevealed || grid[row][col].isFlagged || grid[row][col].isMine) return

    grid[row][col].isRevealed = true

    if (grid[row][col].adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          revealCellRecursive(grid, row + dr, col + dc)
        }
      }
    }
  }

  const toggleFlag = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()
    if (gameOver || won || grid[row][col].isRevealed) return
    
    incrementClicks()

    const newGrid = [...grid.map(r => [...r])]
    newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged
    
    // Update mines remaining (but sometimes count wrong)
    const flagged = newGrid.flat().filter(c => c.isFlagged).length
    const displayRemaining = MINE_COUNT - flagged + (Math.random() < 0.2 ? Math.floor(Math.random() * 5) - 2 : 0)
    setMinesRemaining(displayRemaining)
    
    setGrid(newGrid)
  }

  const checkWin = (grid: CellState[][]) => {
    const allNonMinesRevealed = grid.every(row =>
      row.every(cell => cell.isMine || cell.isRevealed)
    )
    
    if (allNonMinesRevealed) {
      // 30% chance to say "just kidding" and reveal a hidden mine
      if (Math.random() < 0.3) {
        setChaosMessage("Wait... there was one more mine!")
        setTimeout(() => setGameOver(true), 1000)
      } else {
        setWon(true)
        setChaosMessage("You won! Or did you? Actually yes, you did. Maybe.")
      }
    }
  }

  const resetGame = () => {
    setGrid(initializeGrid())
    setGameOver(false)
    setWon(false)
    setMinesRemaining(MINE_COUNT)
    setFirstClick(true)
    setChaosMessage('')
  }

  const getCellColor = (count: number): string => {
    const colors = ['', 'text-blue-600', 'text-green-600', 'text-red-600', 'text-purple-800', 'text-red-800', 'text-cyan-600', 'text-black', 'text-gray-600']
    return colors[count] || ''
  }

  return (
    <div className="flex flex-col items-center p-2 bg-[#c0c0c0] h-full font-['MS_Sans_Serif',Tahoma,sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-2 p-1 bg-[#c0c0c0] border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white">
        <div className="bg-black text-red-500 font-mono px-2 py-1 min-w-[50px] text-center">
          {String(minesRemaining).padStart(3, '0')}
        </div>
        <button 
          onClick={resetGame}
          className="text-2xl px-2 border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 active:border-t-gray-600 active:border-l-gray-600"
        >
          {gameOver ? 'X_X' : won ? 'B)' : ':)'}
        </button>
        <div className="bg-black text-red-500 font-mono px-2 py-1 min-w-[50px] text-center">
          {String(Math.floor(Math.random() * 999)).padStart(3, '0')}
        </div>
      </div>

      {chaosMessage && (
        <div className="text-red-600 text-xs mb-1 text-center animate-pulse">{chaosMessage}</div>
      )}

      {/* Grid */}
      <div className="border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <button
                key={colIndex}
                className={`w-6 h-6 text-xs font-bold flex items-center justify-center
                  ${cell.isRevealed 
                    ? 'bg-[#c0c0c0] border border-gray-400' 
                    : 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600'
                  }
                  ${getCellColor(cell.adjacentMines)}
                `}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => toggleFlag(e, rowIndex, colIndex)}
                disabled={gameOver || won}
              >
                {cell.isRevealed ? (
                  cell.isMine ? '[BOOM]' : (cell.adjacentMines > 0 ? cell.adjacentMines : '')
                ) : cell.isFlagged ? '[F]' : ''}
              </button>
            ))}
          </div>
        ))}
      </div>

      {(gameOver || won) && (
        <div className="mt-2 text-center">
          <p className={`font-bold ${won ? 'text-green-600' : 'text-red-600'}`}>
            {won ? ' YOU WIN! ' : '[BOOM] BOOM! [BOOM]'}
          </p>
          <button 
            onClick={resetGame}
            className="mt-2 px-4 py-1 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 text-sm"
          >
            Play Again
          </button>
        </div>
      )}

      <p className="text-xs mt-2 text-gray-600">Left click: reveal | Right click: flag</p>
      <p className="text-xs text-red-600">(Numbers may or may not be accurate)</p>
    </div>
  )
}
