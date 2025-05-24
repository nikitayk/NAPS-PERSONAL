// MarketDataContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const MarketDataContext = createContext();

export const MarketDataProvider = ({ children }) => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get("/api/market-data");
        setMarketData(response.data);
      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  return (
    <MarketDataContext.Provider value={{ marketData, loading }}>
      {children}
    </MarketDataContext.Provider>
  );
};

export const useMarketData = () => useContext(MarketDataContext);
