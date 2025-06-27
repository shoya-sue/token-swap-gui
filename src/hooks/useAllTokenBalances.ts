'use client'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token'
import { Token } from '@/types'
import { SOLANA_TOKENS } from '@/lib/tokens'

export interface TokenBalance {
  token: Token
  balance: number
  loading: boolean
}

export const useAllTokenBalances = () => {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchAllBalances = async () => {
      if (!publicKey) {
        setTokenBalances([])
        return
      }

      setLoading(true)
      const balances: TokenBalance[] = []

      try {
        // Fetch balances for all tokens in parallel
        const balancePromises = SOLANA_TOKENS.map(async (token) => {
          try {
            let balance = 0
            
            if (token.symbol === 'SOL') {
              // For SOL (native token)
              const solBalance = await connection.getBalance(publicKey)
              balance = solBalance / LAMPORTS_PER_SOL
            } else {
              // For SPL tokens
              try {
                const mintPublicKey = new PublicKey(token.mintAddress)
                const tokenAccount = await getAssociatedTokenAddress(
                  mintPublicKey,
                  publicKey
                )
                
                const accountInfo = await getAccount(connection, tokenAccount)
                balance = Number(accountInfo.amount) / Math.pow(10, token.decimals)
              } catch (error) {
                // Token account doesn't exist, balance is 0
                balance = 0
              }
            }

            return {
              token,
              balance,
              loading: false
            }
          } catch (error) {
            console.error(`Error fetching balance for ${token.symbol}:`, error)
            return {
              token,
              balance: 0,
              loading: false
            }
          }
        })

        const results = await Promise.all(balancePromises)
        setTokenBalances(results)
      } catch (error) {
        console.error('Error fetching token balances:', error)
        // Set all balances to 0 in case of error
        setTokenBalances(
          SOLANA_TOKENS.map(token => ({
            token,
            balance: 0,
            loading: false
          }))
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAllBalances()
  }, [connection, publicKey])

  const refetch = async () => {
    if (!publicKey) return
    
    setLoading(true)
    const balances: TokenBalance[] = []

    try {
      const balancePromises = SOLANA_TOKENS.map(async (token) => {
        try {
          let balance = 0
          
          if (token.symbol === 'SOL') {
            const solBalance = await connection.getBalance(publicKey)
            balance = solBalance / LAMPORTS_PER_SOL
          } else {
            try {
              const mintPublicKey = new PublicKey(token.mintAddress)
              const tokenAccount = await getAssociatedTokenAddress(
                mintPublicKey,
                publicKey
              )
              
              const accountInfo = await getAccount(connection, tokenAccount)
              balance = Number(accountInfo.amount) / Math.pow(10, token.decimals)
            } catch (error) {
              balance = 0
            }
          }

          return {
            token,
            balance,
            loading: false
          }
        } catch (error) {
          console.error(`Error fetching balance for ${token.symbol}:`, error)
          return {
            token,
            balance: 0,
            loading: false
          }
        }
      })

      const results = await Promise.all(balancePromises)
      setTokenBalances(results)
    } catch (error) {
      console.error('Error fetching token balances:', error)
      setTokenBalances(
        SOLANA_TOKENS.map(token => ({
          token,
          balance: 0,
          loading: false
        }))
      )
    } finally {
      setLoading(false)
    }
  }

  return { tokenBalances, loading, refetch }
}