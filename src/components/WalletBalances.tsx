'use client'

import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAllTokenBalances } from '@/hooks/useAllTokenBalances'
import { formatTokenAmount } from '@/lib/tokens'
import Image from 'next/image'

export default function WalletBalances() {
  const { connected } = useWallet()
  const { tokenBalances, loading } = useAllTokenBalances()

  if (!connected) {
    return (
      <div className="w-full max-w-md mx-auto mt-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Token Balances</h3>
            <p className="text-slate-400 text-sm">Connect your wallet to view balances</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Token Balances</h3>
          {loading && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orca-400"></div>
          )}
        </div>
        
        <div className="space-y-3">
          {tokenBalances.map(({ token, balance }) => (
            <div key={token.symbol} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                  {token.logoURI ? (
                    <Image
                      src={token.logoURI}
                      alt={token.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">
                      {token.symbol.slice(0, 2)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-white font-medium">{token.symbol}</div>
                  <div className="text-slate-400 text-xs">{token.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">
                  {formatTokenAmount(balance, token.decimals)}
                </div>
                {balance > 0 && (
                  <div className="text-slate-400 text-xs">
                    {balance.toFixed(token.decimals)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {tokenBalances.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm">No token balances found</p>
          </div>
        )}
      </div>
    </div>
  )
}