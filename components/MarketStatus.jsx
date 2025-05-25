"use client"

// MarketStatus.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useMarket } from "@/context/market-context";
import { Skeleton } from "@/components/ui/skeleton";

const MarketStatus = () => {
  const { marketIndices, isLoading, error } = useMarket();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">Error loading market status: {error}</div>
        </CardContent>
      </Card>
    );
  }

  const getMarketStatus = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const day = now.getDay();

    // Check if it's a weekend
    if (day === 0 || day === 6) return "Closed";

    // Check if it's during market hours (9:30 AM - 4:00 PM EST)
    const marketTime = hour * 100 + minute;
    if (marketTime >= 930 && marketTime <= 1600) return "Open";
    return "Closed";
  };

  const marketStatus = getMarketStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Market Status</h1>
        <Badge variant={marketStatus === "Open" ? "success" : "secondary"}>
          {marketStatus}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {marketIndices.map((market) => {
          const isPositive = market.change >= 0;
          return (
            <Card key={market.symbol}>
              <CardHeader>
                <CardTitle>{market.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{market.price.toFixed(2)}</span>
                    <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {isPositive ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                      <span className="ml-1">
                        {market.change.toFixed(2)} ({market.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Last Updated: {market.lastUpdated}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MarketStatus;
