'use client'

import { useWindowStore } from '@/stores/windowStore'
import { useAppStore } from '@/stores/appStore'

const menuItems = [
  { id: 'ca', icon: '[CA]', label: 'Contract Address' },
  { id: 'manifesto', icon: '[DOC]', label: 'manifesto.exe' },
  { id: 'games', icon: '[GAME]', label: 'Games', hasSubmenu: true },
  { id: 'minesweeper', icon: '[BOMB]', label: 'Minesweeper', indent: true },
  { id: 'snake', icon: '[SNAKE]', label: 'Snake', indent: true },
  { id: 'paint', icon: '[PAINT]', label: 'Paint', indent: true },
  { id: 'divider1', divider: true },
  { id: 'chart', icon: '[CHART]', label: 'Chart' },
  { id: 'gallery', icon: '[IMG]', label: 'Gallery' },
  { id: 'readme', icon: '[TXT]', label: 'README.txt' },
  { id: 'socials', icon: '[MSG]', label: 'Socials' },
  { id: 'divider2', divider: true },
  { id: 'shutdown', icon: '⚡', label: 'Shut Down...' },
]

const appConfigs: Record<string, { title: string; icon: string; width: number; height: number }> = {
  ca: { title: 'CA.exe - Contract Address', icon: '[CA]', width: 450, height: 400 },
  manifesto: { title: 'manifesto.exe - Notepad', icon: '[DOC]', width: 500, height: 400 },
  readme: { title: 'README.txt - Notepad', icon: '[TXT]', width: 450, height: 350 },
  games: { title: '2024 Games', icon: '[GAME]', width: 300, height: 200 },
  minesweeper: { title: 'Minesweeper - $2024 Edition', icon: '[BOMB]', width: 320, height: 420 },
  paint: { title: 'Paint', icon: '[PAINT]', width: 600, height: 450 },
  snake: { title: 'Snake', icon: '[SNAKE]', width: 400, height: 450 },
  chart: { title: 'chart.exe - Internet Explorer', icon: '[CHART]', width: 800, height: 600 },
  socials: { title: 'Socials', icon: '[MSG]', width: 300, height: 250 },
  gallery: { title: 'Gallery', icon: '[IMG]', width: 600, height: 500 },
}

export function StartMenu() {
  const { openWindow } = useWindowStore()
  const { setStartMenuOpen } = useAppStore()

  const handleItemClick = (id: string) => {
    if (id === 'shutdown') {
      // Could add a shutdown animation here
      return
    }
    if (id === 'games') return // Just a label

    const config = appConfigs[id]
    if (!config) return

    openWindow({
      id,
      title: config.title,
      icon: config.icon,
      component: id,
      x: 100 + Math.random() * 200,
      y: 50 + Math.random() * 100,
      width: config.width,
      height: config.height,
    })
    setStartMenuOpen(false)
  }

  return (
    <div 
      className="absolute bottom-[40px] left-1 w-[220px] bg-[#ece9d8] border-t-2 border-l-2 border-[#fff] border-r-2 border-b-2 border-r-[#848484] border-b-[#848484] shadow-xl z-[9999]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a246a] to-[#a6caf0] p-2 flex items-center gap-2">
        <span className="text-2xl">[WIN]</span>
        <span className="text-white font-bold text-lg">$2024</span>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        {menuItems.map((item) => {
          if (item.divider) {
            return <div key={item.id} className="h-px bg-[#848484] mx-2 my-1" />
          }

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`
                flex items-center gap-2 w-full px-3 py-1.5 text-left text-sm
                hover:bg-[#316ac5] hover:text-white
                ${item.indent ? 'pl-8' : ''}
                ${item.hasSubmenu ? 'font-medium' : ''}
              `}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
