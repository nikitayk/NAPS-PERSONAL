// StockSearchBar.jsx
import React, { useState } from "react";

const StockSearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setSearchTerm("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a stock..."
          className="p-2 border rounded-l w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default StockSearchBar;
