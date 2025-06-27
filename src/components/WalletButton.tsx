'use client'

import React, { FC } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export const WalletButton: FC = () => {
  const { wallet, publicKey, connecting, connected } = useWallet()

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div className="flex items-center space-x-3">
      {connected && publicKey && (
        <div className="hidden sm:flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-slate-300">
            {formatAddress(publicKey.toString())}
          </span>
        </div>
      )}
      
      <WalletMultiButton 
        className="!bg-gradient-to-r !from-purple-500 !to-pink-500 hover:!from-purple-600 hover:!to-pink-600 !text-white !rounded-lg !font-medium !transition-all !duration-200 !shadow-lg hover:!shadow-xl !border-0 !px-4 !py-2"
      />
    </div>
  )
}