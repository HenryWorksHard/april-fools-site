'use client'

interface RecycleItem {
  ticker: string
  name: string
  athMcap: string
  currentMcap: string
  athDate: string
}

const recycleItems: RecycleItem[] = [
  { ticker: '$WIF', name: 'dogwifhat', athMcap: '$4.8B', currentMcap: '$172M', athDate: 'Mar 2024' },
  { ticker: '$BONK', name: 'Bonk', athMcap: '$5.1B', currentMcap: '$533M', athDate: 'Nov 2024' },
  { ticker: '$POPCAT', name: 'Popcat', athMcap: '$2.0B', currentMcap: '$51M', athDate: 'Nov 2024' },
  { ticker: '$MEW', name: 'cat in a dogs world', athMcap: '$1.1B', currentMcap: '$54M', athDate: 'Nov 2024' },
  { ticker: '$MOTHER', name: 'Mother Iggy', athMcap: '$222M', currentMcap: '$1.1M', athDate: 'Jun 2024' },
  { ticker: '$DADDY', name: 'Daddy Tate', athMcap: '$173M', currentMcap: '$3.7M', athDate: 'Jun 2024' },
  { ticker: '$PNUT', name: 'Peanut the Squirrel', athMcap: '$2.4B', currentMcap: '$46M', athDate: 'Nov 2024' },
  { ticker: '$GOAT', name: 'Goatseus Maximus', athMcap: '$1.3B', currentMcap: '$19M', athDate: 'Nov 2024' },
  { ticker: '$FARTCOIN', name: 'Fartcoin', athMcap: '$2.5B', currentMcap: '$158M', athDate: 'Jan 2025' },
  { ticker: '$SLERF', name: 'Slerf', athMcap: '$800M', currentMcap: '$2.1M', athDate: 'Mar 2024' },
  { ticker: '$TREMP', name: 'Doland Tremp', athMcap: '$151M', currentMcap: '$592K', athDate: '2024' },
]

export function RecycleBin() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Menu Bar */}
      <div className="flex items-center bg-[#ece9d8] border-b border-[#848484] px-1 py-0.5 text-xs">
        <button className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white">File</button>
        <button className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white">Edit</button>
        <button className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white">View</button>
        <button className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white">Help</button>
      </div>

      {/* Title */}
      <div className="bg-[#ffffc8] border-b border-[#808080] p-2 text-xs">
        <p className="font-bold">🗑️ Deleted Gains - 2024 Memecoins</p>
        <p className="text-[#808080]">All-Time High Market Caps vs Now. RIP.</p>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[80px_1fr_100px_100px] bg-[#ece9d8] border-b border-[#848484] text-xs font-semibold">
        <div className="px-2 py-1 border-r border-[#848484]">Ticker</div>
        <div className="px-2 py-1 border-r border-[#848484]">Name</div>
        <div className="px-2 py-1 border-r border-[#848484]">ATH MCap</div>
        <div className="px-2 py-1">Now</div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-auto">
        {recycleItems.map((item, index) => (
          <div 
            key={index}
            className="grid grid-cols-[80px_1fr_100px_100px] text-xs border-b border-[#e5e5e5] hover:bg-[#316ac5] hover:text-white group cursor-default"
          >
            <div className="px-2 py-1.5 font-bold text-[#316ac5] group-hover:text-white truncate">
              {item.ticker}
            </div>
            <div className="px-2 py-1.5 truncate" title={item.name}>
              {item.name}
            </div>
            <div className="px-2 py-1.5 text-[#008000] group-hover:text-white font-mono">
              {item.athMcap}
            </div>
            <div className="px-2 py-1.5 text-[#cc0000] group-hover:text-white font-mono">
              {item.currentMcap}
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-[#ffffc8] border-t border-[#808080] p-2 text-xs">
        <p className="font-bold">These gains cannot be recovered.</p>
        <p className="text-[#808080]">They exist only in our memories now. Return to Tradition.</p>
      </div>

      {/* Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#848484] px-2 py-1 text-xs text-[#808080]">
        {recycleItems.length} coins - billions of dollars of unrealized gains
      </div>
    </div>
  )
}
