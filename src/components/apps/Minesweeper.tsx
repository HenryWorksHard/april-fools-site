'use client'

import { useState, useCallback } from 'react'

const ROWS = 9
const COLS = 9
const MINES = 10

type CellState = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  adjacentMines: number
}

function createBoard(): CellState[][] {
  // Create empty board
  const board: CellState[][] = Array(ROWS).fill(null).map(() =>
    Array(COLS).fill(null).map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  )

  // Place mines randomly
  let minesPlaced = 0
  while (minesPlaced < MINES) {
    const row = Math.floor(Math.random() * ROWS)
    const col = Math.floor(Math.random() * COLS)
    if (!board[row][col].isMine) {
      board[row][col].isMine = true
      minesPlaced++
    }
  }

  // Calculate adjacent mines
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!board[r][c].isMine) {
        let count = 0
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr
            const nc = c + dc
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].isMine) {
              count++
            }
          }
        }
        board[r][c].adjacentMines = count
      }
    }
  }

  return board
}

export function Minesweeper() {
  const [board, setBoard] = useState<CellState[][]>(() => createBoard())
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [flagCount, setFlagCount] = useState(0)

  const revealCell = useCallback((row: number, col: number) => {
    if (gameOver || won) return
    
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(r => r.map(c => ({ ...c })))
      const cell = newBoard[row][col]
      
      if (cell.isRevealed || cell.isFlagged) return prevBoard

      cell.isRevealed = true

      if (cell.isMine) {
        // Game over - reveal all mines
        newBoard.forEach(r => r.forEach(c => {
          if (c.isMine) c.isRevealed = true
        }))
        setGameOver(true)
        return newBoard
      }

      // Flood fill for empty cells
      if (cell.adjacentMines === 0) {
        const stack: [number, number][] = [[row, col]]
        while (stack.length > 0) {
          const [r, c] = stack.pop()!
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr
              const nc = c + dc
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                const neighbor = newBoard[nr][nc]
                if (!neighbor.isRevealed && !neighbor.isMine && !neighbor.isFlagged) {
                  neighbor.isRevealed = true
                  if (neighbor.adjacentMines === 0) {
                    stack.push([nr, nc])
                  }
                }
              }
            }
          }
        }
      }

      // Check win condition
      const allNonMinesRevealed = newBoard.every(r =>
        r.every(c => c.isMine || c.isRevealed)
      )
      if (allNonMinesRevealed) {
        setWon(true)
      }

      return newBoard
    })
  }, [gameOver, won])

  const flagCell = useCallback((e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()
    if (gameOver || won) return

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(r => r.map(c => ({ ...c })))
      const cell = newBoard[row][col]
      
      if (cell.isRevealed) return prevBoard

      cell.isFlagged = !cell.isFlagged
      setFlagCount(prev => cell.isFlagged ? prev + 1 : prev - 1)
      
      return newBoard
    })
  }, [gameOver, won])

  const resetGame = () => {
    setBoard(createBoard())
    setGameOver(false)
    setWon(false)
    setFlagCount(0)
  }

  const getCellContent = (cell: CellState) => {
    if (cell.isFlagged) return '[F]'
    if (!cell.isRevealed) return ''
    if (cell.isMine) return '[BOMB]'
    if (cell.adjacentMines === 0) return ''
    return cell.adjacentMines
  }

  const getCellColor = (count: number) => {
    const colors: Record<number, string> = {
      1: 'text-blue-600',
      2: 'text-green-600',
      3: 'text-red-600',
      4: 'text-purple-800',
      5: 'text-red-800',
      6: 'text-cyan-600',
      7: 'text-black',
      8: 'text-gray-600',
    }
    return colors[count] || ''
  }

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-[#c0c0c0] border-b-2 border-[#808080]">
        <div className="bg-black text-red-500 font-mono text-xl px-2 py-1 min-w-[50px] text-center">
          [BOMB] {MINES - flagCount}
        </div>
        <button
          onClick={resetGame}
          className="text-2xl hover:scale-110 transition-transform"
        >
          {gameOver ? 'X_X' : won ? 'B)' : ':)'}
        </button>
        <div className="bg-black text-red-500 font-mono text-xl px-2 py-1 min-w-[50px] text-center">
          $TRAD
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 flex items-center justify-center p-2">
        <div className="inline-block border-2 border-[#808080] border-t-[#fff] border-l-[#fff]">
          {board.map((row, rowIdx) => (
            <div key={rowIdx} className="flex">
              {row.map((cell, colIdx) => (
                <button
                  key={colIdx}
                  onClick={() => revealCell(rowIdx, colIdx)}
                  onContextMenu={(e) => flagCell(e, rowIdx, colIdx)}
                  className={`
                    w-6 h-6 text-xs font-bold flex items-center justify-center
                    ${cell.isRevealed
                      ? 'bg-[#c0c0c0] border border-[#808080]'
                      : 'bg-[#c0c0c0] border-2 border-[#fff] border-r-[#808080] border-b-[#808080] hover:bg-[#d0d0d0]'
                    }
                    ${cell.isRevealed && cell.isMine ? 'bg-red-500' : ''}
                    ${getCellColor(cell.adjacentMines)}
                  `}
                >
                  {getCellContent(cell)}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-center py-1 text-[#808080] bg-[#c0c0c0]">
        Left click: reveal | Right click: flag [F] | Mines = bundle dumps [X]
      </div>
    </div>
  )
}
