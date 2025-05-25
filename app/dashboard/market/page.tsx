"use client"

import React from "react"
import { MarketStatus } from "@/components/MarketStatus"
import { PopularStocks } from "@/components/PopularStocks"
import { Watchlist } from "@/components/Watchlist"
import { StockQuote } from "@/components/StockQuote"
import { PriceChart } from "@/components/PriceChart"

export default function MarketPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <MarketStatus />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <StockQuote stockSymbol="AAPL" />
          <PriceChart stockSymbol="AAPL" />
        </div>
        <div className="space-y-6">
          <PopularStocks />
          <Watchlist />
        </div>
      </div>
    </div>
  )
} 