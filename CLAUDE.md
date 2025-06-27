# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Orca token swap GUI - a Next.js 14 application for swapping Solana tokens using the Orca DEX. The application features a Japanese-language requirements document and implements a token swap interface with wallet connectivity.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom Orca brand colors
- **Wallet Integration**: Solana Wallet Adapter
- **Notifications**: react-hot-toast
- **Blockchain**: Solana mainnet via @solana/web3.js

### Key Directories
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components for UI
- `src/hooks/` - Custom React hooks (wallet balance fetching)
- `src/lib/` - Utility functions and token definitions
- `src/types/` - TypeScript type definitions

### Component Architecture
The app follows a component-driven architecture:

- **WalletContextProvider**: Provides Solana wallet connectivity (Phantom, Solflare)
- **SwapInterface**: Main swap component with token selection and amount inputs
- **TokenSelect**: Dropdown for token selection from predefined list
- **SwapButton**: Handles swap execution logic
- **Header**: App header with wallet connection status
- **useWalletBalance**: Hook for fetching SOL and SPL token balances

### Token Management
- Supports 8 major Solana tokens: SOL, USDC, USDT, mSOL, stSOL, BONK, WIF, JUP
- Token metadata includes mint addresses, decimals, logos, and CoinGecko IDs
- Balance formatting utilities handle different number ranges (K/M suffixes)

### Styling Approach
- Uses Tailwind with custom color palette including Orca branding
- Glass morphism design with backdrop blur effects
- Dark theme with purple gradient background
- Responsive design for desktop/tablet/mobile

### Wallet Integration
- Connects to Solana mainnet by default
- Supports auto-connect for wallet persistence
- Handles SOL native balance and SPL token account queries
- Uses Associated Token Accounts for SPL tokens

### State Management
- Uses React hooks (useState, useEffect) for local component state
- Custom hooks abstract wallet interaction logic
- No global state management library (Zustand mentioned in requirements but not implemented)

## Development Notes

### Configuration
- Next.js config includes webpack fallbacks for Node.js modules (fs, net, tls) for browser compatibility
- TypeScript configured with path aliases (`@/*` maps to `src/*`)
- Tailwind includes @tailwindcss/forms plugin

### Current Implementation Status
- Basic swap interface with mock calculations (not connected to actual Orca SDK)
- Wallet balance fetching implemented
- UI components and styling complete
- Missing: Real Orca integration, actual swap execution, slippage handling

### API Endpoints
- Uses Solana mainnet RPC via clusterApiUrl
- Ready for custom RPC endpoint configuration (Helius/QuickNode as per requirements)