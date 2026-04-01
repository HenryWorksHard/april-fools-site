'use client'

import { useWindowStore } from '@/stores/windowStore'
import { useAppStore } from '@/stores/appStore'

const menuItems = [
  { id: 'internet', icon: '🌐', label: 'Internet', highlight: true },
  { id: 'email', icon: '📧', label: 'E-mail', highlight: true },
  { id: 'divider1', divider: true },
  { id: 'readme', icon: '📄', label: 'My Documents' },
  { id: 'gallery', icon: '🖼️', label: 'My Pictures' },
  { id: 'chart', icon: '📊', label: 'My Scores' },
  { id: 'divider2', divider: true },
  { id: 'games', icon: '🎮', label: 'Games', hasSubmenu: true },
  { id: 'minesweeper', icon: '💣', label: 'Minesweeper', indent: true },
  { id: 'snake', icon: '🐍', label: 'Snake', indent: true },
  { id: 'paint', icon: '🎨', label: 'Paint', indent: true },
  { id: 'divider3', divider: true },
  { id: 'ca', icon: '📋', label: 'Secret Code' },
  { id: 'manifesto', icon: '📝', label: 'Notepad' },
  { id: 'socials', icon: '💬', label: 'Messenger' },
  { id: 'recyclebin', icon: '🗑️', label: 'Recycle Bin' },
]

const bottomItems = [
  { id: 'shutdown', icon: '⚡', label: 'Turn Off Computer' },
]

const appConfigs: Record<string, { title: string; icon: string; width: number; height: number }> = {
  ca: { title: 'Secret Code', icon: '📋', width: 450, height: 400 },
  manifesto: { title: 'Notepad', icon: '📝', width: 500, height: 400 },
  readme: { title: 'My Documents', icon: '📄', width: 450, height: 350 },
  games: { title: 'Games', icon: '🎮', width: 300, height: 200 },
  minesweeper: { title: 'Minesweeper', icon: '💣', width: 320, height: 420 },
  paint: { title: 'Paint', icon: '🎨', width: 600, height: 450 },
  snake: { title: 'Snake', icon: '🐍', width: 400, height: 450 },
  chart: { title: 'My Scores', icon: '📊', width: 800, height: 600 },
  socials: { title: 'Messenger', icon: '💬', width: 300, height: 250 },
  gallery: { title: 'My Pictures', icon: '🖼️', width: 600, height: 500 },
  recyclebin: { title: 'Recycle Bin', icon: '🗑️', width: 500, height: 400 },
  internet: { title: 'Internet Explorer', icon: '🌐', width: 700, height: 500 },
  email: { title: 'Outlook Express', icon: '📧', width: 600, height: 450 },
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
      className="absolute bottom-[40px] left-0 w-[380px] bg-[#d4d0c8] shadow-2xl z-[9999] select-none"
      style={{
        border: '1px solid #808080',
        borderTop: '1px solid #fff',
        borderLeft: '1px solid #fff',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header Banner - Blue gradient like XP */}
      <div 
        className="h-[60px] flex items-center px-3 gap-3"
        style={{
          background: 'linear-gradient(180deg, #1f5fc0 0%, #2968c8 8%, #3f80e8 40%, #2968c8 88%, #1f5fc0 100%)',
        }}
      >
        {/* User Avatar */}
        <div className="w-[48px] h-[48px] rounded-[3px] bg-white/90 flex items-center justify-center text-2xl shadow-md border-2 border-[#4a90d9]">
          🤡
        </div>
        <div>
          <span className="text-white font-bold text-lg drop-shadow-sm">$FOOL</span>
          <p className="text-white/80 text-xs">foolcoin</p>
        </div>
      </div>

      {/* Main Content - Two columns like XP */}
      <div className="flex">
        {/* Left Column - White background, frequently used */}
        <div className="w-1/2 bg-white py-1 border-r border-[#a0a0a0]">
          {menuItems.slice(0, 6).map((item) => {
            if (item.divider) {
              return <div key={item.id} className="h-[1px] bg-[#c0c0c0] mx-2 my-1" />
            }
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`
                  flex items-center gap-2 w-full px-2 py-1.5 text-left text-[11px]
                  hover:bg-[#316ac5] hover:text-white
                  ${item.highlight ? 'font-bold' : ''}
                `}
              >
                <span className="text-base w-6 text-center">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
          
          <div className="h-[1px] bg-[#c0c0c0] mx-2 my-2" />
          <p className="px-2 text-[10px] text-gray-500">All Programs ▸</p>
        </div>

        {/* Right Column - Light blue/gray background */}
        <div 
          className="w-1/2 py-1"
          style={{ background: 'linear-gradient(180deg, #d3e5fa 0%, #b9d3f3 100%)' }}
        >
          {menuItems.slice(6).map((item) => {
            if (item.divider) {
              return <div key={item.id} className="h-[1px] bg-[#8faed3] mx-2 my-1" />
            }
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`
                  flex items-center gap-2 w-full px-2 py-1 text-left text-[11px]
                  hover:bg-[#316ac5] hover:text-white
                  ${item.indent ? 'pl-6' : ''}
                  ${item.hasSubmenu ? 'font-medium' : ''}
                `}
              >
                <span className="text-sm w-5 text-center">{item.icon}</span>
                <span>{item.label}</span>
                {item.hasSubmenu && <span className="ml-auto">▸</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Footer - Log Off / Turn Off */}
      <div 
        className="flex justify-end items-center gap-4 px-3 py-2 border-t border-[#808080]"
        style={{
          background: 'linear-gradient(180deg, #3c81d8 0%, #2968c8 100%)',
        }}
      >
        <button 
          onClick={() => handleItemClick('shutdown')}
          className="flex items-center gap-1 text-white text-[11px] hover:underline"
        >
          <span>🔌</span>
          <span>Log Off</span>
        </button>
        <button 
          onClick={() => handleItemClick('shutdown')}
          className="flex items-center gap-1 text-white text-[11px] hover:underline"
        >
          <span>⚡</span>
          <span>Turn Off Computer</span>
        </button>
      </div>
    </div>
  )
}
