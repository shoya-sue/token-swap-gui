'use client'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token'
import { Token } from '@/types'

export const useWalletBalance = (token: Token | null) => {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey || !token) {
        setBalance(0)
        return
      }

      setLoading(true)
      try {
        if (token.symbol === 'SOL') {
          // For SOL (native token)
          const balance = await connection.getBalance(publicKey)
          setBalance(balance / LAMPORTS_PER_SOL)
        } else {
          // For SPL tokens
          try {
            const mintPublicKey = new PublicKey(token.mintAddress)
            const tokenAccount = await getAssociatedTokenAddress(
              mintPublicKey,
              publicKey
            )
            
            const accountInfo = await getAccount(connection, tokenAccount)
            const balance = Number(accountInfo.amount) / Math.pow(10, token.decimals)
            setBalance(balance)
          } catch (error) {
            // Token account doesn't exist, balance is 0
            setBalance(0)
          }
        }
      } catch (error) {
        console.error('Error fetching balance:', error)
        setBalance(0)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [connection, publicKey, token])

  return { balance, loading }
}