// PriceChart.jsx
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const PriceChart = ({ stockSymbol }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(`/api/price-chart?symbol=${stockSymbol}`);
        setChartData(response.data);
      } catch (error) {
        console.error("Error fetching price chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [stockSymbol]);

  if (loading) {
    return <div>Loading price chart...</div>;
  }

  const data = {
    labels: chartData.dates,
    datasets: [
      {
        label: "Price",
        data: chartData.prices,
        borderColor: "#4A90E2",
        backgroundColor: "rgba(74, 144, 226, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Price Chart</h2>
      <Line data={data} />
    </div>
  );
};

export default PriceChart;