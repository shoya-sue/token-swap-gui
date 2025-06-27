'use client'

import React from 'react'
import { WalletButton } from './WalletButton'

export default function Header() {
  return (
    <header className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orca-400 to-orca-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Orca Token Swap</h1>
            <p className="text-slate-400 text-sm">Powered by Orca DEX</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <WalletButton />
        </div>
      </div>
    </header>
  )
}