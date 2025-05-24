import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Custom hook to fetch real-time stock prices.
 * @param {string} stockSymbol - The stock symbol to fetch data for.
 * @returns {object} - { price, error, loading }
 */
const useRealTimePrice = (stockSymbol) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPrice = async () => {
      try {
        const response = await axios.get(`/api/real-time-price?symbol=${stockSymbol}`);
        if (isMounted) {
          setPrice(response.data.price);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Error fetching real-time price");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPrice();

    const interval = setInterval(fetchPrice, 5000); // Fetch every 5 seconds
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [stockSymbol]);

  return { price, error, loading };
};

export default useRealTimePrice;
