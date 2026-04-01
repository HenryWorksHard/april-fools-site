'use client'

import { useChaosStore } from '@/stores/chaosStore'

export function Socials() {
  const { incrementClicks, showClippy } = useChaosStore()

  const handleClick = (platform: string) => {
    incrementClicks()
    if (Math.random() < 0.4) {
      showClippy(`Opening ${platform}? In this economy?`)
    }
  }

  return (
    <div className="p-4 bg-[#c0c0c0] h-full font-['MS_Sans_Serif',Tahoma,sans-serif]">
      <div className="text-center mb-6">
        <span className="text-4xl mb-2 block">💬</span>
        <p className="font-bold">Messenger</p>
        <p className="text-xs text-gray-600 mt-1">Connect with... nobody</p>
      </div>
      
      <div className="space-y-3">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); handleClick('Twitter'); }}
          className="flex items-center gap-3 p-3 bg-white border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white hover:bg-gray-100"
        >
          <span className="text-2xl">🐦</span>
          <div>
            <span className="font-bold text-sm">Twitter</span>
            <span className="text-xs text-gray-500 block">@nobody</span>
          </div>
        </a>
        
        <a 
          href="#"
          onClick={(e) => { e.preventDefault(); handleClick('Telegram'); }}
          className="flex items-center gap-3 p-3 bg-white border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white hover:bg-gray-100"
        >
          <span className="text-2xl">✈️</span>
          <div>
            <span className="font-bold text-sm">Telegram</span>
            <span className="text-xs text-gray-500 block">Join the void</span>
          </div>
        </a>
        
        <a 
          href="#"
          onClick={(e) => { e.preventDefault(); handleClick('Website'); }}
          className="flex items-center gap-3 p-3 bg-white border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white hover:bg-gray-100"
        >
          <span className="text-2xl">🌐</span>
          <div>
            <span className="font-bold text-sm">Website</span>
            <span className="text-xs text-gray-500 block">You're already here</span>
          </div>
        </a>
      </div>
      
      <p className="text-center text-xs text-gray-500 mt-4">
        All links lead to disappointment
      </p>
    </div>
  )
}
