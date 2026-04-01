'use client'

import { useState, useEffect, useRef } from 'react'
import { useChaosStore } from '@/stores/chaosStore'

const trollMessages = [
  "Did you really think this would work normally?",
  "APRIL FOOLS! Your text is now backwards.",
  "Error: Brain.exe has stopped working",
  "The cake is a lie. So is this notepad.",
  "Congratulations! You've been selected for a free rug pull!",
  "Loading financial advice... just kidding, DYOR.",
  "Your typing speed: Slow. Your trading speed: Also slow.",
  "Fun fact: This text will self-destruct in... just kidding. Or will it?",
]

export function ChaosNotepad() {
  const [text, setText] = useState('')
  const [displayText, setDisplayText] = useState('')
  const [mode, setMode] = useState<'normal' | 'reverse' | 'scramble' | 'replace'>('normal')
  const [showTroll, setShowTroll] = useState(false)
  const [trollMessage, setTrollMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { incrementClicks } = useChaosStore()

  useEffect(() => {
    // Pick a random chaos mode
    const modes: Array<'normal' | 'reverse' | 'scramble' | 'replace'> = ['normal', 'reverse', 'scramble', 'replace']
    setMode(modes[Math.floor(Math.random() * modes.length)])
    
    // Show initial troll message after 3 seconds
    setTimeout(() => {
      setTrollMessage(trollMessages[Math.floor(Math.random() * trollMessages.length)])
      setShowTroll(true)
      setTimeout(() => setShowTroll(false), 3000)
    }, 3000)
  }, [])

  const scrambleText = (str: string): string => {
    return str.split(' ').map(word => {
      if (word.length <= 3) return word
      const middle = word.slice(1, -1).split('').sort(() => Math.random() - 0.5).join('')
      return word[0] + middle + word[word.length - 1]
    }).join(' ')
  }

  const leetSpeak = (str: string): string => {
    const replacements: Record<string, string> = {
      'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7', 'l': '1'
    }
    return str.split('').map(char => {
      const lower = char.toLowerCase()
      return replacements[lower] || char
    }).join('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    incrementClicks()
    const newText = e.target.value
    setText(newText)
    
    // Apply chaos based on mode
    switch (mode) {
      case 'reverse':
        setDisplayText(newText.split('').reverse().join(''))
        break
      case 'scramble':
        setDisplayText(scrambleText(newText))
        break
      case 'replace':
        setDisplayText(leetSpeak(newText))
        break
      default:
        // "Normal" but occasionally insert random characters
        if (Math.random() < 0.05 && newText.length > 0) {
          const randomChars = '!@#$%^&*()[X][GO]🌙lol'
          const randomChar = randomChars[Math.floor(Math.random() * randomChars.length)]
          const pos = Math.floor(Math.random() * newText.length)
          setDisplayText(newText.slice(0, pos) + randomChar + newText.slice(pos))
        } else {
          setDisplayText(newText)
        }
    }

    // Random troll popup
    if (Math.random() < 0.02) {
      setTrollMessage(trollMessages[Math.floor(Math.random() * trollMessages.length)])
      setShowTroll(true)
      setTimeout(() => setShowTroll(false), 2000)
    }
  }

  const handleSave = () => {
    incrementClicks()
    setTrollMessage("File saved to: /dev/null (just kidding, nothing was saved)")
    setShowTroll(true)
    setTimeout(() => setShowTroll(false), 3000)
  }

  const handleClear = () => {
    incrementClicks()
    // 50% chance to actually clear, 50% chance to add more text
    if (Math.random() < 0.5) {
      setText('')
      setDisplayText('')
    } else {
      const additions = [
        "\n\nYou thought you could delete this? APRIL FOOLS!",
        "\n\n[This text cannot be deleted. It lives here now.]",
        "\n\nClear button machine broke. Understandable, have a nice day.",
      ]
      const addition = additions[Math.floor(Math.random() * additions.length)]
      setText(prev => prev + addition)
      setDisplayText(prev => prev + addition)
    }
  }

  const getModeLabel = () => {
    switch (mode) {
      case 'reverse': return '~ Reverse Mode'
      case 'scramble': return '🔀 Scramble Mode'
      case 'replace': return '1337 L33t Mode'
      default: return '[TXT] Normal Mode (suspicious)'
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-['MS_Sans_Serif',Tahoma,sans-serif]">
      {/* Menu bar */}
      <div className="flex items-center gap-1 p-1 border-b border-gray-400 text-sm">
        <button 
          onClick={handleSave}
          className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white"
        >
          File
        </button>
        <button 
          onClick={() => {
            incrementClicks()
            setTrollMessage("Edit menu is under construction. Forever.")
            setShowTroll(true)
            setTimeout(() => setShowTroll(false), 2000)
          }}
          className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white"
        >
          Edit
        </button>
        <button 
          onClick={() => {
            incrementClicks()
            alert("Help is not available. You're on your own.")
          }}
          className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white"
        >
          Help
        </button>
        <span className="ml-auto text-xs text-gray-600">{getModeLabel()}</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-1 border-b border-gray-400">
        <button 
          onClick={handleClear}
          className="px-2 py-1 text-xs border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600"
        >
          Clear (probably)
        </button>
        <button 
          onClick={handleSave}
          className="px-2 py-1 text-xs border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600"
        >
          Save
        </button>
      </div>

      {/* Troll message popup */}
      {showTroll && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#ffffcc] border-2 border-black p-4 z-50 shadow-lg max-w-[80%]">
          <div className="flex items-start gap-2">
            <span className="text-2xl">[CLIP]</span>
            <div>
              <p className="text-sm">{trollMessage}</p>
              <button 
                onClick={() => setShowTroll(false)}
                className="mt-2 px-3 py-1 text-xs border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 bg-[#c0c0c0]"
              >
                OK (sigh)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Text area */}
      <div className="flex-1 p-1">
        <textarea
          ref={textareaRef}
          value={displayText}
          onChange={handleChange}
          className="w-full h-full p-2 font-mono text-sm resize-none border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white focus:outline-none"
          placeholder="Type something... if you dare..."
          spellCheck={false}
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between p-1 border-t border-gray-400 text-xs">
        <span>Chars: {displayText.length} | Words: {displayText.split(/\s+/).filter(Boolean).length}</span>
        <span className="text-red-600">[!] Auto-save: Disabled Forever</span>
      </div>
    </div>
  )
}
