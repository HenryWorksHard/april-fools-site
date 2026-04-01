'use client'

import { useState, CSSProperties } from 'react'

interface DesktopIconProps {
  icon: string
  label: string
  onDoubleClick: () => void
  style?: CSSProperties
}

export function DesktopIcon({ icon, label, onDoubleClick, style }: DesktopIconProps) {
  const [isSelected, setIsSelected] = useState(false)

  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-1 p-2 cursor-pointer select-none
        w-20 min-h-[70px]
        ${isSelected ? 'bg-[#316ac5]/50' : 'hover:bg-[#316ac5]/30'}
      `}
      style={style}
      onClick={() => setIsSelected(true)}
      onDoubleClick={onDoubleClick}
      onBlur={() => setIsSelected(false)}
      tabIndex={0}
    >
      <span className="text-4xl drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{icon}</span>
      <span className={`
        text-white text-xs text-center leading-tight max-w-[72px]
        drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]
        ${isSelected ? 'bg-[#316ac5]' : ''}
      `}>
        {label}
      </span>
    </div>
  )
}
