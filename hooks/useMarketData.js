// useMarketData.js
import { useContext } from "react";
import { MarketDataContext } from "./MarketDataContext";

/**
 * Custom hook to access market data context.
 * @returns {object} - Market data context values.
 */
export const useMarketData = () => {
  const context = useContext(MarketDataContext);
  if (!context) {
    throw new Error("useMarketData must be used within a MarketDataProvider");
  }
  return context;
};
