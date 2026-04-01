'use client'

import { Desktop } from '@/components/desktop/Desktop'
import { BouncingCA } from '@/components/BouncingCA'

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <Desktop />
      <BouncingCA />
    </main>
  )
}
