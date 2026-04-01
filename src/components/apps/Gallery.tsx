'use client'

import { useState } from 'react'
import { useChaosStore } from '@/stores/chaosStore'

const galleryItems = [
  { id: '1', name: 'Nothing.jpg', description: 'This is literally nothing.', image: '' },
  { id: '2', name: 'Invisible_Art.png', description: 'Very expensive invisible art.', image: '' },
  { id: '3', name: 'Loading_Forever.gif', description: 'Still loading since 1999.', image: '' },
  { id: '4', name: '404_Image.bmp', description: 'Image not found. Forever.', image: '' },
  { id: '5', name: 'Your_Expectations.tiff', description: 'Subverted successfully.', image: '' },
  { id: '6', name: 'April_Fools.raw', description: 'You fell for it.', image: '' },
]

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { incrementClicks, showClippy } = useChaosStore()

  const handleImageClick = (id: string) => {
    incrementClicks()
    setSelectedImage(id)
    
    if (Math.random() < 0.3) {
      showClippy("Looking for images? There are none. This is art.")
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-['MS_Sans_Serif',Tahoma,sans-serif]">
      <div className="p-3 border-b-2 border-[#808080]">
        <h2 className="text-lg font-bold">Gallery of Nothing</h2>
        <p className="text-[#808080] text-xs mt-1">A curated collection of absolutely nothing</p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleImageClick(item.id)}
              className={`
                border-2 p-2 cursor-pointer transition-all
                ${selectedImage === item.id 
                  ? 'border-[#316ac5] bg-[#e8f4ff]' 
                  : 'border-[#808080] hover:border-[#316ac5]'
                }
              `}
            >
              <div className="aspect-square bg-gray-300 mb-2 flex items-center justify-center text-gray-500 text-xs">
                [Image Not Found]
              </div>
              <div className="text-center">
                <p className="font-bold text-sm">{item.name}</p>
                <p className="text-xs text-[#808080] mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2 border-t border-[#808080] text-xs text-center">
        {selectedImage 
          ? `Selected: ${galleryItems.find(i => i.id === selectedImage)?.name} (Still nothing)`
          : 'Click an image to view nothing in detail'
        }
      </div>
    </div>
  )
}
