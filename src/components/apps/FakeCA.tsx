'use client'

import { useState } from 'react'
import { useChaosStore } from '@/stores/chaosStore'

const fakeAddresses = [
  "APRIL420FOOLS69LMAO2026GOTTEM",
  "RUGpuLL111111111111111111111",
  "NGMI5555555555555555555555555",
  "DYOR0000000000000000000000000",
  "TrU5tM3Br0111111111111111111",
  "NotAScam99999999999999999999",
  "DeFinitely1Real11111111111111",
  "🚀🌙💎🙌🦍📈🔥💀😂🤡",
]

const trollCopies = [
  "Copied: APRIL FOOLS! 🎉",
  "Copied: HA! You thought.",
  "Copied: Your mom's wallet address",
  "Copied: 0x0000...0000 (empty wallet)",
  "Copied: The address of deez nuts",
  "Copied: Nothing. Absolutely nothing.",
  "Copied to clipboard: Trust issues",
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
    navigator.clipboard.writeText("APRIL FOOLS! There is no CA. 🎉").catch(() => {})
    
    setCopyMessage(trollText)
    setCopied(true)
    
    setTimeout(() => {
      setCopied(false)
    }, 2000)

    // Show clippy on 3rd click
    if (clickCount === 2) {
      showClippy("I see you're trying to copy a contract address. Would you like me to help you lose money faster?")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-[#c0c0c0] font-['MS_Sans_Serif',Tahoma,sans-serif]">
      <div className="text-center mb-4">
        <div className="text-6xl mb-2">📋</div>
        <h2 className="text-lg font-bold">Contract Address</h2>
        <p className="text-xs text-gray-600 mt-1">(100% legitimate, trust me bro)</p>
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
          <p className="font-bold mb-1">⚠️ WARNING:</p>
          <p>This contract has been audited by absolutely no one. DYOR (Do Your Own Regret).</p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Token Launch: April 1st, 2026
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
            <p className="text-4xl mb-4">🎉 APRIL FOOLS! 🎉</p>
            <p className="text-lg">There is no token.</p>
            <p className="text-lg">There was never a token.</p>
            <p className="text-sm mt-4 text-gray-400">But thanks for the engagement!</p>
          </div>
        </div>
      )}
    </div>
  )
}
