"use client"

import React from 'react'
import StockQuote from '@/components/StockQuote'
import PriceChart from '@/components/PriceChart'

export default function StockPage({ params }: { params: { symbol: string } }) {
  return (
    <div className="container py-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StockQuote stockSymbol={params.symbol} />
        <PriceChart stockSymbol={params.symbol} />
      </div>
    </div>
  )
} 