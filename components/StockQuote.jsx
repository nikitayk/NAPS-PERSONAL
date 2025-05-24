// StockQuote.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const StockQuote = ({ stockSymbol }) => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockQuote = async () => {
      try {
        const response = await axios.get(`/api/stock-quote?symbol=${stockSymbol}`);
        setQuote(response.data);
      } catch (error) {
        console.error("Error fetching stock quote:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockQuote();
  }, [stockSymbol]);

  if (loading) {
    return <div>Loading stock quote...</div>;
  }

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold">Stock Quote for {stockSymbol}</h2>
      <p>Price: {quote.price}</p>
      <p>Change: {quote.change}</p>
      <p>Volume: {quote.volume}</p>
    </div>
  );
};

export default StockQuote;
