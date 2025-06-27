'use client'

import React, { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Token } from '@/types'
import { SOLANA_TOKENS, formatTokenAmount } from '@/lib/tokens'
import { useWalletBalance } from '@/hooks/useWalletBalance'
import { useAllTokenBalances } from '@/hooks/useAllTokenBalances'
import { useSwapQuote } from '@/hooks/useSwapQuote'
import { useSwap } from '@/hooks/useSwap'
import TokenSelect from './TokenSelect'
import SwapButton from './SwapButton'

export default function SwapInterface() {
  const { connected } = useWallet()
  const [fromToken, setFromToken] = useState<Token>(SOLANA_TOKENS[0]) // SOL
  const [toToken, setToToken] = useState<Token>(SOLANA_TOKENS[1])     // USDC
  const [fromAmount, setFromAmount] = useState<string>('')
  const [toAmount, setToAmount] = useState<string>('')
  const [slippage, setSlippage] = useState<number>(0.5)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const { balance: fromBalance, loading: balanceLoading } = useWalletBalance(fromToken)
  const { tokenBalances } = useAllTokenBalances()
  const { quote, loading: quoteLoading, error: quoteError } = useSwapQuote(fromToken, toToken, fromAmount, slippage)
  const { executeSwap } = useSwap()
  
  // Get toToken balance from all balances
  const toTokenBalance = tokenBalances.find(tb => tb.token.symbol === toToken.symbol)?.balance || 0

  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    // toAmount will be updated automatically via useSwapQuote
  }

  // Update toAmount when quote changes
  React.useEffect(() => {
    if (quote && quote.estimatedAmountOut) {
      setToAmount(quote.estimatedAmountOut.toFixed(6))
    } else if (!fromAmount || fromAmount === '0') {
      setToAmount('')
    }
  }, [quote, fromAmount])

  const slippageOptions = [0.1, 0.5, 1.0]

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Swap Tokens</h2>
          <p className="text-slate-300 text-sm">Trade tokens instantly on Orca</p>
        </div>

        {/* From Token Section */}
        <div className="mb-4">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex justify-between items-center mb-2">
              <label className="text-slate-400 text-sm">From</label>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 text-sm">
                  Balance: {connected ? (balanceLoading ? '...' : formatTokenAmount(fromBalance, fromToken.decimals)) : '0.00'}
                </span>
                {connected && fromBalance > 0 && (
                  <button
                    onClick={() => handleFromAmountChange(fromBalance.toString())}
                    className="text-orca-400 hover:text-orca-300 text-sm font-medium"
                  >
                    MAX
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TokenSelect
                selectedToken={fromToken}
                onTokenSelect={setFromToken}
                tokens={SOLANA_TOKENS}
              />
              <input
                type="text"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-white text-xl font-medium placeholder-slate-500 border-none outline-none text-right"
              />
            </div>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSwapTokens}
            className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center transition-colors duration-200 border-2 border-slate-600"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </button>
        </div>

        {/* To Token Section */}
        <div className="mb-6">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex justify-between items-center mb-2">
              <label className="text-slate-400 text-sm">To</label>
              <span className="text-slate-400 text-sm">
                Balance: {connected ? formatTokenAmount(toTokenBalance, toToken.decimals) : '0.00'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <TokenSelect
                selectedToken={toToken}
                onTokenSelect={setToToken}
                tokens={SOLANA_TOKENS}
              />
              <div className="flex-1 flex items-center justify-end">
                {quoteLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orca-400"></div>
                ) : (
                  <input
                    type="text"
                    value={toAmount}
                    readOnly
                    placeholder="0.00"
                    className="w-full bg-transparent text-white text-xl font-medium placeholder-slate-500 border-none outline-none text-right"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Slippage Settings */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-slate-400 text-sm">Slippage Tolerance</label>
            <span className="text-white text-sm">{slippage}%</span>
          </div>
          <div className="flex space-x-2">
            {slippageOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSlippage(option)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  slippage === option
                    ? 'bg-orca-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {option}%
              </button>
            ))}
            <input
              type="number"
              value={slippage}
              onChange={(e) => setSlippage(Number(e.target.value))}
              step="0.1"
              min="0.1"
              max="50"
              className="w-20 py-2 px-3 bg-slate-700 text-white text-sm rounded-lg border border-slate-600 outline-none focus:border-orca-500"
            />
          </div>
        </div>

        {/* Trade Info */}
        {fromAmount && toAmount && quote && (
          <div className="mb-6 bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="text-slate-400">Rate</span>
              <span className="text-white">
                1 {fromToken.symbol} = {quote.rate.toFixed(4)} {toToken.symbol}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="text-slate-400">Price Impact</span>
              <span className={`${quote.priceImpactPct.abs().lt(0.01) ? 'text-green-400' : quote.priceImpactPct.abs().lt(1) ? 'text-yellow-400' : 'text-red-400'}`}>
                {quote.priceImpactPct.abs().lt(0.01) ? '<0.01%' : `${quote.priceImpactPct.abs().toFixed(2)}%`}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Minimum Received</span>
              <span className="text-white">
                {quote.estimatedAmountOutWithSlippage.toFixed(6)} {toToken.symbol}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-slate-400">Trading Fee</span>
              <span className="text-white">
                ~0.3% (estimated)
              </span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {quoteError && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 text-sm">{quoteError}</p>
          </div>
        )}

        {/* Swap Button */}
        <SwapButton
          fromToken={fromToken}
          toToken={toToken}
          fromAmount={fromAmount}
          toAmount={toAmount}
          quote={quote}
          quoteLoading={quoteLoading}
          slippage={slippage}
          onSwap={async (fromToken, toToken, amount, slippage) => {
            try {
              await executeSwap(fromToken, toToken, amount, slippage)
              // Reset form after successful swap
              setFromAmount('')
              setToAmount('')
            } catch (error) {
              console.error('Swap failed:', error)
            }
          }}
        />
      </div>

      {/* Pool Info Card */}
      <div className="mt-6 bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <h3 className="text-white font-medium mb-3">Pool Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Pool</span>
            <span className="text-white">{fromToken.symbol}-{toToken.symbol} Whirlpool</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">TVL</span>
            <span className="text-white">$12.5M</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">24h Volume</span>
            <span className="text-white">$2.1M</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">APR</span>
            <span className="text-green-400">8.45%</span>
          </div>
        </div>
      </div>
    </div>
  )
}