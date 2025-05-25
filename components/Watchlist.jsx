"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMarket } from "@/context/market-context";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpIcon, ArrowDownIcon, XIcon, SearchIcon } from "lucide-react";
import { marketService } from "@/lib/services/market";
import { useToast } from "@/components/ui/use-toast";

const Watchlist = () => {
  const { watchlist, isLoading, error, addToWatchlist, removeFromWatchlist } = useMarket();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await marketService.searchStocks(searchQuery);
      setSearchResults(results);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to search stocks",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            {[1, 2, 3, 4, 5].map((index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">Error loading watchlist: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              <SearchIcon className="h-4 w-4" />
            </Button>
          </div>

          {searchResults.length > 0 && (
            <Card>
              <CardContent className="p-2">
                <ScrollArea className="h-[100px]">
                  {searchResults.map((result) => (
                    <Button
                      key={result.symbol}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        addToWatchlist(result.symbol);
                        setSearchResults([]);
                        setSearchQuery("");
                      }}
                    >
                      <span className="font-medium">{result.symbol}</span>
                      <span className="ml-2 text-muted-foreground">{result.name}</span>
                    </Button>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {watchlist.map((stock) => {
                const isPositive = stock.change >= 0;
                return (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors group"
                  >
                    <div>
                      <h3 className="font-semibold">{stock.symbol}</h3>
                      <p className="text-sm text-muted-foreground">
                        Vol: {stock.volume.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">${stock.price.toFixed(2)}</p>
                        <p className={`text-sm flex items-center justify-end ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {isPositive ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : <ArrowDownIcon className="w-3 h-3 mr-1" />}
                          {stock.changePercent.toFixed(2)}%
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFromWatchlist(stock.symbol)}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default Watchlist; 