"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { marketService, type MarketQuote, type MarketIndex } from '@/lib/services/market'
import { websocketService } from '@/lib/services/websocket'
import { useToast } from '@/components/ui/use-toast'

interface MarketContextType {
  popularStocks: MarketQuote[]
  marketIndices: MarketIndex[]
  watchlist: MarketQuote[]
  isLoading: boolean
  error: string | null
  addToWatchlist: (symbol: string) => Promise<void>
  removeFromWatchlist: (symbol: string) => Promise<void>
  refreshData: () => Promise<void>
}

const MarketContext = createContext<MarketContextType | undefined>(undefined)

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [popularStocks, setPopularStocks] = useState<MarketQuote[]>([])
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([])
  const [watchlist, setWatchlist] = useState<MarketQuote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleQuoteUpdate = (data: MarketQuote) => {
    // Update popular stocks
    setPopularStocks(prev =>
      prev.map(stock =>
        stock.symbol === data.symbol
          ? { ...stock, ...data, lastUpdated: new Date().toLocaleTimeString() }
          : stock
      )
    )

    // Update watchlist
    setWatchlist(prev =>
      prev.map(stock =>
        stock.symbol === data.symbol
          ? { ...stock, ...data, lastUpdated: new Date().toLocaleTimeString() }
          : stock
      )
    )

    // Update market indices
    setMarketIndices(prev =>
      prev.map(index =>
        index.symbol === data.symbol
          ? { ...index, ...data, lastUpdated: new Date().toLocaleTimeString() }
          : index
      )
    )
  }

  const refreshData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [popularData, indicesData, watchlistData] = await Promise.all([
        marketService.getPopularStocks(),
        marketService.getMarketStatus(),
        marketService.getWatchlist(),
      ])

      setPopularStocks(popularData)
      setMarketIndices(indicesData)
      setWatchlist(watchlistData)

      // Subscribe to updates for all symbols
      const allSymbols = new Set([
        ...popularData.map(stock => stock.symbol),
        ...indicesData.map(index => index.symbol),
        ...watchlistData.map(stock => stock.symbol),
      ])

      allSymbols.forEach(symbol => {
        websocketService.subscribe(symbol, handleQuoteUpdate)
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load market data'
      setError(message)
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addToWatchlist = async (symbol: string) => {
    try {
      await marketService.addToWatchlist(symbol)
      const quote = await marketService.getQuote(symbol)
      setWatchlist(prev => [...prev, quote])
      websocketService.subscribe(symbol, handleQuoteUpdate)
      toast({
        title: 'Success',
        description: `${symbol} added to watchlist`,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add to watchlist'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
      throw err
    }
  }

  const removeFromWatchlist = async (symbol: string) => {
    try {
      await marketService.removeFromWatchlist(symbol)
      setWatchlist(prev => prev.filter(stock => stock.symbol !== symbol))
      websocketService.unsubscribe(symbol, handleQuoteUpdate)
      toast({
        title: 'Success',
        description: `${symbol} removed from watchlist`,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove from watchlist'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
      throw err
    }
  }

  useEffect(() => {
    refreshData()
    return () => {
      // Cleanup all subscriptions
      const allSymbols = new Set([
        ...popularStocks.map(stock => stock.symbol),
        ...marketIndices.map(index => index.symbol),
        ...watchlist.map(stock => stock.symbol),
      ])
      allSymbols.forEach(symbol => {
        websocketService.unsubscribe(symbol, handleQuoteUpdate)
      })
    }
  }, [])

  return (
    <MarketContext.Provider
      value={{
        popularStocks,
        marketIndices,
        watchlist,
        isLoading,
        error,
        addToWatchlist,
        removeFromWatchlist,
        refreshData,
      }}
    >
      {children}
    </MarketContext.Provider>
  )
}

export function useMarket() {
  const context = useContext(MarketContext)
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider')
  }
  return context
} 