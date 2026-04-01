'use client'

import { useEffect, useRef } from 'react'
import { useAppStore } from '@/stores/appStore'
import { CONTRACT_ADDRESS } from '@/config/contract'

export function Landing() {
  const { setPhase } = useAppStore()
  const videoRef = useRef<HTMLVideoElement>(null)

  // Aggressively preload video on page load
  useEffect(() => {
    // Preload desktop background
    const img = new Image()
    img.src = '/images/bliss.jpg'
    
    // Force video to buffer by loading it
    if (videoRef.current) {
      videoRef.current.load()
    }
  }, [])

  return (
    <div 
      className="w-full h-screen bg-black flex flex-col items-center justify-center cursor-pointer"
      onClick={() => setPhase('video')}
    >
      {/* Hidden video element to force preloading */}
      <video 
        ref={videoRef}
        src="/video/intro.mp4" 
        preload="auto"
        muted
        playsInline
        className="hidden"
      />
      
      {/* Preload hints */}
      <link rel="preload" href="/video/intro.mp4" as="video" type="video/mp4" />
      <link rel="preload" href="/images/bliss.jpg" as="image" />
      
      {/* 2024 Logo */}
      <div className="mb-16 text-center">
        <h1 className="text-7xl md:text-9xl font-bold text-white tracking-tight">
          2024
        </h1>
      </div>

      {/* Click to Enter */}
      <div className="text-gray-400 text-lg tracking-widest animate-pulse">
        [ CLICK TO ENTER ]
      </div>

      {/* Tagline */}
      <p className="text-gray-400 mt-4 text-sm md:text-base text-center leading-relaxed">
        Return to the good times, return to tradition, return to... <span className="text-white font-bold">$2024</span>
      </p>

      {/* Contract Address */}
      <p className="text-green-500 mt-8 text-xs font-mono">
        CA: {CONTRACT_ADDRESS}
      </p>
    </div>
  )
}
