// MarketStatus.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const MarketStatus = () => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const response = await axios.get("/api/market-status"); // Adjust endpoint if needed
        setMarketData(response.data);
      } catch (error) {
        console.error("Error fetching market status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketStatus();
  }, []);

  if (loading) {
    return <div>Loading market status...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Market Status</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {marketData.map((item, index) => (
          <div key={index} className="p-4 border rounded shadow-md">
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p>Status: {item.status}</p>
            <p>Last Updated: {item.lastUpdated}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketStatus;
