'use client'

import { useState } from 'react'
import { useChaosStore } from '@/stores/chaosStore'

const deletedFiles = [
  { name: 'Important_Project.doc', size: '2.4 MB', date: 'Last week' },
  { name: 'Old_Photos.zip', size: '156 MB', date: 'Yesterday' },
  { name: 'Tax_Returns.pdf', size: '890 KB', date: 'April 1st' },
  { name: 'Game_Saves.bak', size: '45 MB', date: 'Long ago' },
  { name: 'Unnamed_Folder', size: '???', date: 'Unknown' },
  { name: 'System32.dll', size: 'DO NOT', date: 'DELETE' },
  { name: 'ReadMe_Important.txt', size: '1 KB', date: 'Never read' },
  { name: 'Good_Ideas.doc', size: '0 KB', date: 'Empty' },
  { name: 'Passwords.txt', size: 'Oops', date: 'Too late' },
  { name: 'My_Homework.final.v2.REAL.doc', size: '420 KB', date: '4/1' },
]

export function RecycleBin() {
  const [selected, setSelected] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const { incrementClicks } = useChaosStore()

  const handleSelect = (name: string) => {
    incrementClicks()
    setSelected(name)
  }

  const handleRestore = () => {
    incrementClicks()
    if (!selected) {
      setMessage("Select a file first... or don't. I'm not your boss.")
      setTimeout(() => setMessage(''), 2000)
      return
    }
    
    const responses = [
      "Error: File has moved on. It's in a better place now.",
      "Cannot restore: File is having an existential crisis.",
      "Restoration denied: File doesn't want to come back.",
      "Error 418: I'm a teapot, not a file restorer.",
      "This file was never real. April Fools!",
    ]
    setMessage(responses[Math.floor(Math.random() * responses.length)])
    setTimeout(() => setMessage(''), 3000)
  }

  const handleEmpty = () => {
    incrementClicks()
    setMessage("Are you sure? Actually, it doesn't matter. Nothing works here.")
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div className="h-full bg-[#c0c0c0] font-['MS_Sans_Serif',Tahoma,sans-serif] flex flex-col">
      {/* Header */}
      <div className="p-2 border-b border-gray-400">
        <p className="font-bold">[BIN] Recycle Bin</p>
        <p className="text-xs text-gray-600">Deleted files go here to contemplate their existence</p>
      </div>

      {message && (
        <div className="bg-yellow-100 border-b border-yellow-400 p-2 text-xs text-center">
          {message}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex gap-2 p-2 border-b border-gray-400">
        <button 
          onClick={handleRestore}
          className="px-2 py-1 text-xs border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600"
        >
          Restore
        </button>
        <button 
          onClick={handleEmpty}
          className="px-2 py-1 text-xs border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600"
        >
          Empty Bin
        </button>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-auto p-2">
        <div className="bg-white border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white">
          {/* Header row */}
          <div className="flex text-xs font-bold bg-gray-200 border-b border-gray-400 p-1">
            <div className="w-6">🗑️</div>
            <div className="flex-1">Name</div>
            <div className="w-20 text-right">Size</div>
            <div className="w-24 text-right">Deleted</div>
          </div>
          
          {deletedFiles.map((file) => (
            <div
              key={file.name}
              onClick={() => handleSelect(file.name)}
              className={`flex items-center text-xs p-1 cursor-pointer border-b border-gray-100
                ${selected === file.name ? 'bg-[#316ac5] text-white' : 'hover:bg-gray-100'}
              `}
            >
              <div className="w-6">📄</div>
              <div className="flex-1 truncate">{file.name}</div>
              <div className="w-20 text-right">{file.size}</div>
              <div className="w-24 text-right">{file.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="p-1 border-t border-gray-400 text-xs flex justify-between">
        <span>{deletedFiles.length} items (none recoverable)</span>
        <span className="text-gray-500">Total chaos: Yes</span>
      </div>
    </div>
  )
}
