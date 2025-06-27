'use client'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useState, useCallback } from 'react'
import { Token } from '@/types'
import { createOrcaSwapService } from '@/lib/orca'
import toast from 'react-hot-toast'

export interface SwapState {
  isLoading: boolean
  error: string | null
  signature: string | null
}

export const useSwap = () => {
  const { connection } = useConnection()
  const wallet = useWallet()
  const [swapState, setSwapState] = useState<SwapState>({
    isLoading: false,
    error: null,
    signature: null
  })

  const executeSwap = useCallback(async (
    fromToken: Token,
    toToken: Token,
    amount: string,
    slippage: number = 0.5
  ) => {
    if (!wallet.wallet || !wallet.publicKey) {
      toast.error('Please connect your wallet')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setSwapState({
      isLoading: true,
      error: null,
      signature: null
    })

    try {
      toast.loading('Preparing swap transaction...', { id: 'swap-loading' })
      
      const orcaService = createOrcaSwapService(connection, wallet.wallet)
      
      const signature = await orcaService.executeSwap(
        fromToken,
        toToken,
        amount,
        slippage,
        wallet.publicKey
      )

      if (signature) {
        setSwapState({
          isLoading: false,
          error: null,
          signature
        })
        
        toast.success(`Swap successful! Transaction: ${signature.slice(0, 8)}...`, {
          id: 'swap-loading',
          duration: 5000
        })
        
        return signature
      } else {
        throw new Error('Transaction failed')
      }
    } catch (error: any) {
      console.error('Swap failed:', error)
      
      const errorMessage = error.message || 'Swap failed. Please try again.'
      
      setSwapState({
        isLoading: false,
        error: errorMessage,
        signature: null
      })
      
      toast.error(errorMessage, { id: 'swap-loading' })
      
      throw error
    }
  }, [connection, wallet.wallet, wallet.publicKey])

  const resetSwapState = useCallback(() => {
    setSwapState({
      isLoading: false,
      error: null,
      signature: null
    })
  }, [])

  return {
    executeSwap,
    resetSwapState,
    ...swapState
  }
}