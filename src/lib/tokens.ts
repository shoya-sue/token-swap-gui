import { Token } from '@/types'

export const SOLANA_TOKENS: Token[] = [
  {
    symbol: 'SOL',
    name: 'Solana',
    mintAddress: 'So11111111111111111111111111111111111111112',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    coingeckoId: 'solana'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
    coingeckoId: 'usd-coin'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    mintAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png',
    coingeckoId: 'tether'
  },
  {
    symbol: 'mSOL',
    name: 'Marinade Staked SOL',
    mintAddress: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png',
    coingeckoId: 'marinade-staked-sol'
  },
  {
    symbol: 'stSOL',
    name: 'Lido Staked SOL',
    mintAddress: '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj/logo.png',
    coingeckoId: 'lido-staked-sol'
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    mintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    decimals: 5,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png',
    coingeckoId: 'bonk'
  },
  {
    symbol: 'WIF',
    name: 'dogwifhat',
    mintAddress: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm/logo.png',
    coingeckoId: 'dogwifcoin'
  },
  {
    symbol: 'JUP',
    name: 'Jupiter',
    mintAddress: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN/logo.png',
    coingeckoId: 'jupiter-exchange-solana'
  }
]

export const getTokenBySymbol = (symbol: string): Token | undefined => {
  return SOLANA_TOKENS.find(token => token.symbol === symbol)
}

export const getTokenByMint = (mintAddress: string): Token | undefined => {
  return SOLANA_TOKENS.find(token => token.mintAddress === mintAddress)
}

export const formatTokenAmount = (amount: number, decimals: number): string => {
  if (amount === 0) return '0'
  
  if (amount < 0.001) {
    return amount.toExponential(2)
  }
  
  if (amount < 1) {
    return amount.toFixed(6)
  }
  
  if (amount < 1000) {
    return amount.toFixed(3)
  }
  
  if (amount < 1000000) {
    return (amount / 1000).toFixed(2) + 'K'
  }
  
  return (amount / 1000000).toFixed(2) + 'M'
}