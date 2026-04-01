'use client'

import { useEffect, useRef } from 'react'
import { useAppStore } from '@/stores/appStore'

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
      
      {/* FOOLS Logo */}
      <div className="mb-16 text-center">
        <h1 className="text-7xl md:text-9xl font-bold text-white tracking-tight">
          FOOLS
        </h1>
        <p className="text-gray-500 text-sm mt-2">April 1st Edition</p>
      </div>

      {/* Click to Enter */}
      <div className="text-gray-400 text-lg tracking-widest animate-pulse">
        [ CLICK TO ENTER ]
      </div>

      {/* Tagline */}
      <p className="text-gray-400 mt-4 text-sm md:text-base text-center leading-relaxed">
        A nostalgic trip back to simpler times...
      </p>
    </div>
  )
}
