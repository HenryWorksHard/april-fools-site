'use client'

import { useEffect, useState } from 'react'
import { useChaosStore } from '@/stores/chaosStore'

const fakeErrors = [
  "WALLET_DRAIN_COMPLETE",
  "SEED_PHRASE_LEAKED",
  "RUG_PULL_INITIATED",
  "DIAMOND_HANDS_NOT_FOUND",
  "PAPER_HANDS_DETECTED",
  "TRUST_WALLET_HACKED",
  "LIQUIDITY_REMOVED",
  "DEV_SOLD_EXCEPTION",
  "FOMO_OVERFLOW_ERROR",
  "NGMI_FATAL_ERROR",
]

export function BSOD() {
  const { dismissBSOD } = useChaosStore()
  const [progress, setProgress] = useState(0)
  const [showContinue, setShowContinue] = useState(false)
  const randomError = fakeErrors[Math.floor(Math.random() * fakeErrors.length)]
  
  useEffect(() => {
    // Fake progress that goes backwards sometimes
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setShowContinue(true)
          return 100
        }
        // Sometimes go backwards
        if (Math.random() < 0.2 && prev > 10) {
          return prev - Math.floor(Math.random() * 15)
        }
        return prev + Math.floor(Math.random() * 8)
      })
    }, 300)
    
    return () => clearInterval(interval)
  }, [])

  const handleContinue = () => {
    // 50% chance to dismiss, 50% chance to reset progress
    if (Math.random() > 0.5) {
      dismissBSOD()
    } else {
      setProgress(0)
      setShowContinue(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-[#0000aa] z-[10000] flex flex-col items-center justify-center p-8 font-mono text-white">
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl mb-8 text-center">:( Your PC ran into a problem</h1>
        
        <div className="bg-[#0000aa] text-white mb-8">
          <p className="mb-4">A problem has been detected and Windows has been shut down to prevent damage to your wallet.</p>
          
          <p className="mb-4">The problem seems to be caused by the following file: APRIL_FOOLS.SYS</p>
          
          <p className="mb-4 text-yellow-300">{randomError}</p>
          
          <p className="mb-4">If this is the first time you've seen this error screen, congratulations! You've been fooled.</p>
          
          <p className="mb-4">Technical information:</p>
          <p className="mb-2">*** STOP: 0x00000069 (0xAPRIL, 0xF00LS, 0x2026, 0xLMAO)</p>
          <p className="mb-4">*** april_fools.sys - Address 0xDEADBEEF base at 0x69420000</p>
        </div>

        <div className="mb-4">
          <p className="mb-2">Collecting error info... {Math.min(progress, 100)}% complete</p>
          <div className="w-full h-4 bg-[#000066] border border-white">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {showContinue && (
          <div className="text-center">
            <button 
              onClick={handleContinue}
              className="bg-white text-[#0000aa] px-8 py-2 font-bold hover:bg-gray-200 mt-4"
            >
              Press any key to continue (or don't, we don't care)
            </button>
            <p className="text-xs mt-4 text-gray-400">
              Just kidding. Happy April Fools! 🎉
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
