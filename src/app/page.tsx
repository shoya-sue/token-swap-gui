'use client'

import SwapInterface from '@/components/SwapInterface'
import Header from '@/components/Header'
import WalletBalances from '@/components/WalletBalances'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Header />
      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-2xl">
          <SwapInterface />
          <WalletBalances />
        </div>
      </div>
    </main>
  )
}