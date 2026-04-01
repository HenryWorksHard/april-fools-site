'use client'

import { useState } from 'react'
import { useChaosStore } from '@/stores/chaosStore'

const fakeAddresses = [
  "F00L420C01N69LMAO2026GOTTEM",
  "NotARealAddress1111111111111",
  "YouActuallyTriedToCopyThis123",
  "ThisIsDefinitelyLegit99999999",
  "TrustMeBro11111111111111111111",
  "TotallyNotFake9999999999999999",
  "DefinitelyRealAddress11111111",
  "LMAOGETPRANKED420420420420420",
]

const trollCopies = [
  "Copied: foolcoin? More like fooled",
  "Copied: HA! You thought.",
  "Copied: Nothing. Absolutely nothing.",
  "Copied: The lyrics to Never Gonna Give You Up",
  "Copied: A very important message (jk)",
  "Copied: Trust issues",
  "Copied: Air. You copied air.",
]

export function FakeCA() {
  const [copied, setCopied] = useState(false)
  const [copyMessage, setCopyMessage] = useState('')
  const [currentAddress, setCurrentAddress] = useState(fakeAddresses[0])
  const [clickCount, setClickCount] = useState(0)
  const { incrementClicks, showClippy } = useChaosStore()

  const handleCopy = () => {
    incrementClicks()
    setClickCount(prev => prev + 1)
    
    // Change the displayed address each time
    setCurrentAddress(fakeAddresses[clickCount % fakeAddresses.length])
    
    // Copy something random to clipboard (not the actual address)
    const trollText = trollCopies[Math.floor(Math.random() * trollCopies.length)]
    
    // Actually copy a troll message
    navigator.clipboard.writeText("foolcoin.lol - There is no CA. April Fools!").catch(() => {})
    
    setCopyMessage(trollText)
    setCopied(true)
    
    setTimeout(() => {
      setCopied(false)
    }, 2000)

    // Show clippy on 3rd click
    if (clickCount === 2) {
      showClippy("I see you're trying to copy a CA. Would you like me to make it worse?")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-[#c0c0c0] font-['MS_Sans_Serif',Tahoma,sans-serif]">
      <div className="text-center mb-4">
        <div className="text-6xl mb-2">🤡</div>
        <h2 className="text-lg font-bold">foolcoin contract address</h2>
        <p className="text-xs text-gray-600 mt-1">100% legitimate</p>
      </div>

      <div className="w-full max-w-sm">
        <div className="bg-white border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white p-3 mb-3">
          <p className="font-mono text-xs break-all text-center select-all">
            {currentAddress}
          </p>
        </div>

        <button
          onClick={handleCopy}
          className={`w-full py-2 px-4 border-2 text-sm font-bold transition-all
            ${copied 
              ? 'bg-green-500 text-white border-green-700' 
              : 'bg-[#c0c0c0] border-t-white border-l-white border-b-gray-600 border-r-gray-600 hover:bg-[#d0d0d0]'
            }
            active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white
          `}
        >
          {copied ? copyMessage : '📋 Copy CA'}
        </button>

        {clickCount > 0 && (
          <p className="text-xs text-center mt-3 text-red-600 animate-pulse">
            Attempts to copy: {clickCount} | Successful copies: 0
          </p>
        )}

        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-xs">
          <p className="font-bold mb-1">[!] WARNING:</p>
          <p>This CA has been verified by absolutely no one. DYOR (Do Your Own Rugging).</p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Token: foolcoin
          </p>
          <p className="text-xs text-gray-500">
            Total Supply: 420,690,000,000
          </p>
          <p className="text-xs text-gray-500">
            Liquidity: Locked (in our hearts)
          </p>
        </div>
      </div>

      {clickCount >= 5 && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-4xl mb-4">🤡 $FOOLED 🤡</p>
            <p className="text-lg">There is no CA.</p>
            <p className="text-lg">There was never a CA.</p>
            <p className="text-sm mt-4 text-gray-400">foolcoin.lol - Happy April Fools!</p>
          </div>
        </div>
      )}
    </div>
  )
}
