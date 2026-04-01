'use client'

import { useState } from 'react'
import { useChaosStore } from '@/stores/chaosStore'

const socialLinks = [
  { name: 'Twitter', icon: '[TW]', fakeUrl: 'https://twitter.com/elonmusk', label: '@TotallyRealToken' },
  { name: 'Telegram', icon: '[PH]', fakeUrl: 'https://t.me/addstickers/HotCherry', label: 'Join the "community"' },
  { name: 'Discord', icon: '[GAME]', fakeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', label: 'Definitely not a rickroll' },
  { name: 'Website', icon: '[NET]', fakeUrl: 'https://www.google.com/search?q=why+did+i+click+this', label: 'Official Site' },
  { name: 'DexScreener', icon: '[G]', fakeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', label: 'View Chart' },
  { name: 'CoinGecko', icon: '[CG]', fakeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', label: 'CoinGecko Listing' },
]

export function FakeSocials() {
  const [clickedLinks, setClickedLinks] = useState<Set<string>>(new Set())
  const [showWarning, setShowWarning] = useState(false)
  const { incrementClicks } = useChaosStore()

  const handleClick = (name: string, url: string) => {
    incrementClicks()
    
    setClickedLinks(prev => new Set([...prev, name]))
    
    // Show warning first time
    if (clickedLinks.size === 0) {
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 2000)
      return
    }
    
    // Actually open the troll link
    window.open(url, '_blank')
  }

  return (
    <div className="flex flex-col h-full p-4 bg-[#c0c0c0] font-['MS_Sans_Serif',Tahoma,sans-serif]">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold">Join the Community!</h2>
        <p className="text-xs text-gray-600">(What could go wrong?)</p>
      </div>

      {showWarning && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-100 border-2 border-red-600 p-4 z-50 shadow-lg">
          <p className="text-sm font-bold text-red-600">[!] Are you sure?</p>
          <p className="text-xs mt-1">These links may not go where you expect...</p>
          <p className="text-xs mt-2 text-gray-500">(Click again if you dare)</p>
        </div>
      )}

      <div className="space-y-2">
        {socialLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => handleClick(link.name, link.fakeUrl)}
            className={`w-full flex items-center gap-3 p-2 text-left border-2 transition-all
              ${clickedLinks.has(link.name) 
                ? 'bg-red-100 border-red-400' 
                : 'bg-white border-t-white border-l-white border-b-gray-600 border-r-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <span className="text-2xl">{link.icon}</span>
            <div className="flex-1">
              <p className="font-bold text-sm">{link.name}</p>
              <p className="text-xs text-gray-600">{link.label}</p>
            </div>
            {clickedLinks.has(link.name) && (
              <span className="text-xs text-red-600">[!]</span>
            )}
          </button>
        ))}
      </div>

      {clickedLinks.size >= 3 && (
        <div className="mt-4 p-3 bg-yellow-200 border border-yellow-600 text-center">
          <p className="text-sm font-bold"> Achievement Unlocked!</p>
          <p className="text-xs">You clicked {clickedLinks.size} suspicious links.</p>
          <p className="text-xs text-gray-600 mt-1">Your operational security: 0/10</p>
        </div>
      )}

      <div className="mt-auto pt-4 text-center">
        <p className="text-xs text-gray-500">
          Followers: 69,420 (all bots)
        </p>
        <p className="text-xs text-gray-500">
          Community Trust Score: 404
        </p>
      </div>
    </div>
  )
}
