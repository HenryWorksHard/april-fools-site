'use client'

import { useState } from 'react'
import { useChaosStore } from '@/stores/chaosStore'

const deletedItems = [
  { name: 'My_Social_Life.exe', size: '404 KB', date: 'Today', icon: '💀' },
  { name: 'Good_Decisions.pdf', size: '0 KB', date: 'Yesterday', icon: '📄' },
  { name: 'Free_Time.zip', size: 'Empty', date: 'Last week', icon: '📁' },
  { name: 'Trust_Issues.txt', size: 'Corrupted', date: 'Long ago', icon: '📝' },
  { name: 'My_Last_Braincell.jpg', size: 'Tiny', date: 'Every time', icon: '🖼️' },
  { name: 'Sleep_Schedule.xlsx', size: 'Infinite', date: 'Never', icon: '📊' },
  { name: 'Touch_Grass.reminder', size: 'IGNORED', date: 'Oops', icon: '🌿' },
  { name: 'Productive_Day.dream', size: '-69,420 KB', date: 'April 1st', icon: '✨' },
  { name: 'Terms_And_Conditions.log', size: 'Unread', date: 'Always', icon: '📋' },
  { name: 'Important_Email.alert', size: 'Deleted', date: 'Before reading', icon: '⚠️' },
]

export function ChaosRecycleBin() {
  const [items, setItems] = useState(deletedItems)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const { incrementClicks, triggerBSOD } = useChaosStore()

  const handleRestore = () => {
    incrementClicks()
    if (!selectedItem) {
      setMessage("Select something to restore... or don't. Nothing matters anyway.")
      return
    }
    
    // Can't restore anything
    const responses = [
      "Error: Cannot restore. Item has achieved enlightenment.",
      "Restoration failed: File is vibing in the void.",
      "Access denied: This item ghosted you.",
      "Error 69: Nice try, but no.",
      "Cannot restore: Item was never real to begin with.",
      "Restoration requires: Touching grass (not found)",
    ]
    setMessage(responses[Math.floor(Math.random() * responses.length)])
    setTimeout(() => setMessage(''), 3000)
  }

  const handleEmpty = () => {
    incrementClicks()
    
    // 20% chance of BSOD
    if (Math.random() < 0.2) {
      triggerBSOD()
      return
    }
    
    // 50% chance to ADD more items instead of removing
    if (Math.random() < 0.5) {
      const newItems = [
        { name: 'More_Problems.txt', size: 'Growing', date: 'Now', icon: '😭' },
        { name: 'Unread_Messages.pdf', size: 'Large', date: 'Just now', icon: '🧾' },
        { name: 'Procrastination.exe', size: 'Infinite', date: 'Always', icon: '💨' },
      ]
      setItems([...items, newItems[Math.floor(Math.random() * newItems.length)]])
      setMessage("Emptying bin... wait, why is there MORE stuff now?!")
    } else {
      setItems([])
      setMessage("Bin emptied! (Your problems remain)")
      
      // But bring everything back after 2 seconds
      setTimeout(() => {
        setItems(deletedItems)
        setMessage("Just kidding! Nothing is ever truly deleted. Like your browser history.")
      }, 2000)
    }
  }

  const handleDelete = () => {
    incrementClicks()
    if (!selectedItem) return
    
    // Remove item but add something worse
    setItems(prev => {
      const filtered = prev.filter(i => i.name !== selectedItem)
      const newItem = {
        name: 'Even_More_Problems.pain',
        size: 'Immeasurable',
        date: 'Eternal',
        icon: '💔'
      }
      return [...filtered, newItem]
    })
    setSelectedItem(null)
    setMessage("Deleted! ...and replaced with something worse.")
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-['MS_Sans_Serif',Tahoma,sans-serif]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-gray-400">
        <button 
          onClick={handleRestore}
          className="px-2 py-1 text-xs border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600"
        >
          Restore (lol)
        </button>
        <button 
          onClick={handleEmpty}
          className="px-2 py-1 text-xs border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600"
        >
          Empty Bin
        </button>
        <button 
          onClick={handleDelete}
          className="px-2 py-1 text-xs border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600"
        >
          Delete Forever
        </button>
      </div>

      {message && (
        <div className="bg-yellow-200 border-b border-yellow-400 p-2 text-xs text-center">
          {message}
        </div>
      )}

      {/* File list */}
      <div className="flex-1 overflow-auto p-2">
        <div className="bg-white border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white min-h-full">
          {/* Header */}
          <div className="flex items-center p-1 bg-[#c0c0c0] border-b border-gray-400 text-xs font-bold">
            <div className="w-8"></div>
            <div className="flex-1">Name</div>
            <div className="w-20 text-right">Size</div>
            <div className="w-24 text-right">Date Deleted</div>
          </div>
          
          {/* Items */}
          {items.map((item) => (
            <div
              key={item.name}
              onClick={() => {
                incrementClicks()
                setSelectedItem(item.name)
              }}
              className={`flex items-center p-1 text-xs cursor-pointer
                ${selectedItem === item.name ? 'bg-[#316ac5] text-white' : 'hover:bg-gray-100'}
              `}
            >
              <div className="w-8 text-center">{item.icon}</div>
              <div className="flex-1 truncate">{item.name}</div>
              <div className="w-20 text-right">{item.size}</div>
              <div className="w-24 text-right">{item.date}</div>
            </div>
          ))}
          
          {items.length === 0 && (
            <div className="p-4 text-center text-gray-500 text-sm">
              <p>Recycle Bin is empty!</p>
              <p className="text-xs mt-2">(But your responsibilities are not)</p>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between p-1 border-t border-gray-400 text-xs">
        <span>{items.length} items</span>
        <span className="text-red-600">Total chaos: Immeasurable</span>
      </div>
    </div>
  )
}
