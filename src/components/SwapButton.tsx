'use client'

import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Token } from '@/types'
import { SwapQuote } from '@/lib/orca'

interface SwapButtonProps {
  fromToken: Token
  toToken: Token
  fromAmount: string
  toAmount: string
  quote: SwapQuote | null
  quoteLoading: boolean
  slippage: number
  onSwap: (fromToken: Token, toToken: Token, amount: string, slippage: number) => Promise<void>
}

export default function SwapButton({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  quote,
  quoteLoading,
  slippage,
  onSwap
}: SwapButtonProps) {
  const { connected } = useWallet()
  const [isSwapping, setIsSwapping] = React.useState(false)
  
  const isDisabled = !connected || !fromAmount || !toAmount || !quote || quoteLoading || isSwapping || Number(fromAmount) <= 0

  const getButtonText = () => {
    if (!connected) return 'Connect Wallet'
    if (isSwapping) return 'Swapping...'
    if (quoteLoading) return 'Getting quote...'
    if (!fromAmount || Number(fromAmount) <= 0) return 'Enter an amount'
    if (!quote) return 'No liquidity available'
    if (!toAmount) return 'Select tokens'
    return `Swap ${fromToken.symbol} for ${toToken.symbol}`
  }

  const handleSwap = async () => {
    if (isDisabled) return
    
    setIsSwapping(true)
    try {
      await onSwap(fromToken, toToken, fromAmount, slippage)
    } catch (error) {
      console.error('Swap failed:', error)
    } finally {
      setIsSwapping(false)
    }
  }

  return (
    <button
      onClick={handleSwap}
      disabled={isDisabled}
      className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
        isDisabled
          ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-orca-500 to-orca-600 hover:from-orca-600 hover:to-orca-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
      }`}
    >
      <div className="flex items-center justify-center space-x-2">
        {(isSwapping || quoteLoading) && (
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        )}
        <span>{getButtonText()}</span>
      </div>
    </button>
  )
}