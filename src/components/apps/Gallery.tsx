'use client'

import { useState } from 'react'

interface CoinItem {
  id: string
  ticker: string
  name: string
  category: string
  description: string
  image: string // URL to coin logo
}

const coinCollection: CoinItem[] = [
  // The Giants
  { id: '1', ticker: '$WIF', name: 'dogwifhat', category: 'The Giants', description: 'The breakout star. Dog with a pink beanie. Went from nothing to billions. Listed on Binance, Robinhood.', image: 'https://dd.dexscreener.com/ds-data/tokens/solana/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm.png' },
  { id: '2', ticker: '$BONK', name: 'Bonk', category: 'The Giants', description: 'The OG Solana memecoin. Community airdrop to Solana holders. Peaked in 2024.', image: 'https://dd.dexscreener.com/ds-data/tokens/solana/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263.png' },
  { id: '3', ticker: '$POPCAT', name: 'Popcat', category: 'The Giants', description: 'The clicking cat meme. Massive run. Internet culture meets Solana.', image: 'https://dd.dexscreener.com/ds-data/tokens/solana/7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr.png' },
  { id: '4', ticker: '$MEW', name: 'cat in a dogs world', category: 'The Giants', description: 'Cat coin that rivaled the dogs. Started the "cat szn" narrative.', image: 'https://dd.dexscreener.com/ds-data/tokens/solana/MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5.png' },
  
  // pump.fun Era
  { id: '5', ticker: '$MOTHER', name: 'Mother Iggy', category: 'pump.fun Era', description: "Iggy Azalea's coin. Started the celebrity meta on Solana.", image: 'https://dd.dexscreener.com/ds-data/tokens/solana/3S8qX1MsMqRbiwKg2cQyx7nis1oHMgaCuc9c4VfvVdPN.png' },
  { id: '6', ticker: '$DADDY', name: 'Daddy Tate', category: 'pump.fun Era', description: "Andrew Tate's response to MOTHER. The battle of the celebrities.", image: 'https://dd.dexscreener.com/ds-data/tokens/solana/4Cnk9EPnW5ixfLZatCPJjDB1PUtcRpVVgTQukm9epump.png' },
  { id: '7', ticker: '$PNUT', name: 'Peanut the Squirrel', category: 'pump.fun Era', description: 'Went viral after the squirrel was euthanized by NY officials. RIP Peanut.', image: 'https://dd.dexscreener.com/ds-data/tokens/solana/2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump.png' },
  { id: '9', ticker: '$GOAT', name: 'Goatseus Maximus', category: 'pump.fun Era', description: 'AI-generated via Truth Terminal. Started the entire AI agent meta. Narratively significant.', image: 'https://dd.dexscreener.com/ds-data/tokens/solana/CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump.png' },
  { id: '10', ticker: '$FARTCOIN', name: 'Fartcoin', category: 'pump.fun Era', description: 'Exactly what it sounds like. Somehow did numbers. Never underestimate degen energy.', image: 'https://dd.dexscreener.com/ds-data/tokens/solana/9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump.png' },
  
  // Cult/Community Plays
  { id: '10', ticker: '$SLERF', name: 'Slerf', category: 'Cult Plays', description: 'Dev accidentally burned the LP. The mistake became the meme. Community rallied.', image: 'https://dd.dexscreener.com/ds-data/tokens/solana/7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3.png' },
  { id: '11', ticker: '$TREMP', name: 'Doland Tremp', category: 'Cult Plays', description: 'Trump political coin. The other side of the election trade.', image: 'https://dd.dexscreener.com/ds-data/tokens/solana/FU1q8vJpZNUrmqsciSjp8bAKKidGsLmouB8CBdf8TKQv.png' },
]

export function Gallery() {
  const [selectedCoin, setSelectedCoin] = useState<CoinItem | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  const handleImageError = (id: string) => {
    setImageErrors(prev => new Set(prev).add(id))
  }

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2d2d44] to-[#1a1a2e] px-4 py-3 border-b border-[#3d3d5c]">
        <h1 className="text-[#c9a227] font-bold text-lg tracking-wide">The Hall of 2024</h1>
        <p className="text-[#808080] text-xs mt-1">Legendary Solana Memecoins of 2024 — The ones we'll never forget</p>
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          {coinCollection.map((coin) => (
            <button
              key={coin.id}
              onClick={() => setSelectedCoin(coin)}
              className="group relative bg-[#2d2d44] border-4 border-[#c9a227] p-1 hover:border-[#ffd700] transition-colors"
              style={{
                boxShadow: '4px 4px 0 rgba(0,0,0,0.5), inset 0 0 20px rgba(201,162,39,0.1)'
              }}
            >
              {/* Frame */}
              <div className="aspect-square bg-[#0d0d1a] flex items-center justify-center overflow-hidden">
                {imageErrors.has(coin.id) ? (
                  <div className="text-center p-2">
                    <div className="text-4xl mb-2 opacity-50">🪙</div>
                    <div className="text-[#808080] text-xs">{coin.ticker}</div>
                  </div>
                ) : (
                  <img 
                    src={coin.image} 
                    alt={coin.name}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(coin.id)}
                  />
                )}
              </div>
              
              {/* Plaque */}
              <div className="bg-[#c9a227] text-[#1a1a2e] text-center py-1 mt-1">
                <div className="text-xs font-bold truncate px-1">{coin.ticker}</div>
                <div className="text-[10px]">{coin.category}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info Panel - shows when coin selected */}
      {selectedCoin && (
        <div className="bg-[#2d2d44] border-t border-[#3d3d5c] px-4 py-3">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#0d0d1a] flex-shrink-0">
                {imageErrors.has(selectedCoin.id) ? (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🪙</div>
                ) : (
                  <img 
                    src={selectedCoin.image} 
                    alt={selectedCoin.name}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(selectedCoin.id)}
                  />
                )}
              </div>
              <div>
                <h3 className="text-[#c9a227] font-bold">{selectedCoin.ticker} <span className="text-[#808080] font-normal">({selectedCoin.name})</span></h3>
                <p className="text-[#808080] text-sm">{selectedCoin.description}</p>
                <p className="text-[#606060] text-xs mt-1">{selectedCoin.category} • 2024</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedCoin(null)}
              className="text-[#808080] hover:text-white text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Status bar */}
      <div className="bg-[#1a1a2e] border-t border-[#3d3d5c] px-2 py-1 text-xs text-[#606060]">
        {coinCollection.length} legends preserved | Click to inspect | The coins that defined 2024
      </div>
    </div>
  )
}
