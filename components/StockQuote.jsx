"use client"

// StockQuote.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon, StarIcon } from "lucide-react";
import { useMarket } from "@/context/market-context";
import { Skeleton } from "@/components/ui/skeleton";

const StockQuote = ({ stockSymbol }) => {
  const { popularStocks, watchlist, isLoading, addToWatchlist, removeFromWatchlist } = useMarket();

  const quote = [...popularStocks, ...watchlist].find(stock => stock.symbol === stockSymbol);
  const isInWatchlist = watchlist.some(stock => stock.symbol === stockSymbol);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quote) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">Stock not found: {stockSymbol}</div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = quote.change >= 0;
  const handleWatchlistClick = async () => {
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(stockSymbol);
      } else {
        await addToWatchlist(stockSymbol);
      }
    } catch (error) {
      console.error("Failed to update watchlist:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{stockSymbol}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleWatchlistClick}
          className={isInWatchlist ? "text-yellow-500" : "text-muted-foreground"}
        >
          <StarIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">${quote.price.toFixed(2)}</span>
            <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
              <span className="ml-1">
                {quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Volume</span>
              <p className="font-medium">{quote.volume.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated</span>
              <p className="font-medium">{quote.lastUpdated}</p>
            </div>
            <div>
              <span className="text-muted-foreground">High</span>
              <p className="font-medium">${quote.high.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Low</span>
              <p className="font-medium">${quote.low.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Open</span>
              <p className="font-medium">${quote.open.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Prev Close</span>
              <p className="font-medium">${quote.previousClose.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockQuote;
