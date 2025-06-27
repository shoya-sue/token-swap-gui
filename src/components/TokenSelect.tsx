'use client'

import React, { useState } from 'react'
import { Token } from '@/types'

interface TokenSelectProps {
  selectedToken: Token
  onTokenSelect: (token: Token) => void
  tokens: Token[]
}

export default function TokenSelect({ selectedToken, onTokenSelect, tokens }: TokenSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTokens = tokens.filter(token =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg px-3 py-2 transition-colors duration-200 border border-slate-600/50"
      >
        {selectedToken.logoURI && (
          <img
            src={selectedToken.logoURI}
            alt={selectedToken.symbol}
            className="w-6 h-6 rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        )}
        <span className="text-white font-medium">{selectedToken.symbol}</span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-lg border border-slate-600 shadow-xl z-20 max-h-80 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-slate-700">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tokens..."
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-3 py-2 text-sm border border-slate-600 outline-none focus:border-orca-500"
                autoFocus
              />
            </div>

            {/* Token List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredTokens.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-sm">
                  No tokens found
                </div>
              ) : (
                filteredTokens.map((token) => (
                  <button
                    key={token.mintAddress}
                    onClick={() => handleTokenSelect(token)}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 transition-colors duration-200 text-left"
                  >
                    {token.logoURI && (
                      <img
                        src={token.logoURI}
                        alt={token.symbol}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <div className="text-white font-medium">{token.symbol}</div>
                      <div className="text-slate-400 text-sm">{token.name}</div>
                    </div>
                    {selectedToken.mintAddress === token.mintAddress && (
                      <svg
                        className="w-5 h-5 text-orca-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}