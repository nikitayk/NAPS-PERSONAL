import { useState } from "react";
import axios from "axios";

/**
 * Custom hook for searching stocks.
 * @returns {object} - { results, search, error, loading }
 */
const useStockSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/search-stocks?query=${query}`);
      setResults(response.data);
    } catch (err) {
      setError(err.message || "Error searching stocks");
    } finally {
      setLoading(false);
    }
  };

  return { results, search, error, loading };
};

export default useStockSearch;
