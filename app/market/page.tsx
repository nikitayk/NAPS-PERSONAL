"use client"

import React from 'react'
import MarketStatus from '@/components/MarketStatus'
import PopularStocks from '@/components/PopularStocks'
import Watchlist from '@/components/Watchlist'

export default function MarketPage() {
  return (
    <div className="container py-8 space-y-8">
      <MarketStatus />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PopularStocks />
        <Watchlist />
      </div>
    </div>
  )
} 