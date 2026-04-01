'use client'

import { useRef, useEffect, useState } from 'react'
import { useAppStore } from '@/stores/appStore'

export function VideoScreen() {
  const { setPhase, isMuted, toggleMute } = useAppStore()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [showContinue, setShowContinue] = useState(false)

  // Preload desktop background so it's ready when user skips
  useEffect(() => {
    const img = new Image()
    img.src = '/images/bliss.jpg'
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted])

  const handleVideoEnd = () => {
    setShowContinue(true)
  }

  const handleContinue = () => {
    setPhase('desktop')
  }

  // Check if video source exists (will be replaced with actual video)
  const videoSrc = '/video/intro.mp4'

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        src={videoSrc}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted={isMuted}
        onLoadedData={() => setIsVideoLoaded(true)}
        onEnded={handleVideoEnd}
        onError={() => {
          // If video fails to load, show continue button immediately
          setShowContinue(true)
        }}
      />

      {/* Fallback/Placeholder when no video */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="text-6xl mb-4">📼</div>
            <p className="text-gray-500 text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Controls - always visible */}
      <div className="absolute bottom-6 right-6 flex gap-4 z-10">
        <button
          onClick={toggleMute}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 bg-black/50 px-3 py-2 rounded"
        >
          <span>{isMuted ? '🔇' : '🔊'}</span>
          <span className="text-sm">{isMuted ? 'UNMUTE' : 'MUTE'}</span>
        </button>
        <button
          onClick={handleContinue}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 bg-black/50 px-3 py-2 rounded"
        >
          <span>⏭️</span>
          <span className="text-sm">SKIP</span>
        </button>
      </div>

      {/* Continue button after video ends */}
      {showContinue && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <button
            onClick={handleContinue}
            className="text-2xl text-white hover:text-green-400 transition-colors animate-pulse"
          >
            [ CLICK TO CONTINUE ]
          </button>
        </div>
      )}
    </div>
  )
}
