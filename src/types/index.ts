import { PublicKey } from '@solana/web3.js'

export interface Token {
  symbol: string
  name: string
  mintAddress: string
  decimals: number
  logoURI?: string
  coingeckoId?: string
}

export interface TokenBalance {
  token: Token
  balance: number
  uiAmount: number
}

export interface SwapQuote {
  inputAmount: number
  outputAmount: number
  priceImpact: number
  fee: number
  route: string[]
  slippage: number
  minimumReceived: number
}

export interface PoolInfo {
  poolAddress: string
  tokenA: Token
  tokenB: Token
  tvl: number
  volume24h: number
  apr: number
  fee: number
}

export interface SwapState {
  fromToken: Token | null
  toToken: Token | null
  fromAmount: string
  toAmount: string
  slippage: number
  isLoading: boolean
  quote: SwapQuote | null
  poolInfo: PoolInfo | null
}

export interface WalletState {
  connected: boolean
  publicKey: PublicKey | null
  connecting: boolean
  balances: TokenBalance[]
}