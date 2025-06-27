'use client'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState, useCallback } from 'react'
import { Token } from '@/types'
import { createOrcaSwapService, SwapQuote } from '@/lib/orca'
import { useDebounce } from './useDebounce'

export const useSwapQuote = (
  fromToken: Token | null,
  toToken: Token | null,
  fromAmount: string,
  slippage: number = 0.5
) => {
  const { connection } = useConnection()
  const wallet = useWallet()
  const [quote, setQuote] = useState<SwapQuote | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Debounce the input amount to avoid excessive API calls
  const debouncedAmount = useDebounce(fromAmount, 500)

  const fetchQuote = useCallback(async () => {
    if (!fromToken || !toToken || !debouncedAmount || !wallet.wallet || !connection) {
      setQuote(null)
      setError(null)
      return
    }

    // Skip if amount is 0 or invalid
    if (parseFloat(debouncedAmount) <= 0 || isNaN(parseFloat(debouncedAmount))) {
      setQuote(null)
      setError(null)
      return
    }

    // Skip if trying to swap the same token
    if (fromToken.symbol === toToken.symbol) {
      setQuote(null)
      setError('Cannot swap the same token')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const orcaService = createOrcaSwapService(connection, wallet.wallet)
      const swapQuote = await orcaService.getSwapQuote(
        fromToken,
        toToken,
        debouncedAmount,
        slippage
      )

      if (swapQuote) {
        setQuote(swapQuote)
      } else {
        setError('No liquidity pool found for this token pair')
      }
    } catch (err) {
      console.error('Error fetching swap quote:', err)
      setError(err instanceof Error ? err.message : 'Failed to get swap quote')
    } finally {
      setLoading(false)
    }
  }, [fromToken, toToken, debouncedAmount, slippage, wallet.wallet, connection])

  useEffect(() => {
    fetchQuote()
  }, [fetchQuote])

  return {
    quote,
    loading,
    error,
    refetch: fetchQuote
  }
}