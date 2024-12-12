import './style.scss';
import { useState ,useEffect} from 'react';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);



const ExpensesByCategories = () => {
  const [startDate, setStartDate] = useState(""); // Store the start date
  const [endDate, setEndDate] = useState(""); // Store the end date
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#4BC0C0", "#FF6384", "#FFCE56", "#36A2EB"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
      },
    ],
  });

  // Function to fetch chart data
  const fetchChartData = async () => {
    const token = localStorage.getItem("token");
   console.log(startDate)
   console.log(endDate)
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/transaction/piechart?selectedStartDate=${startDate}&selectedEndDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Transform API response data
        const labels = data.chartData.map((item) => item.categoryName); // Category names
        const values = data.chartData.map((item) => item.percentage); // Percentages

        // Update chart data
        setChartData({
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: ["#4BC0C0", "#FF6384", "#FFCE56", "#36A2EB"],
              hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
            },
          ],
        });
      } else {
        console.error("Failed to fetch chart data");
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  // Call fetchChartData on initial render
  useEffect(() => {
    fetchChartData(); // Fetch data for the default date range or entire dataset
  }, []); // Empty dependency array ensures this only runs once on component mount

  const handleDateChange = () => {
    fetchChartData(); // Fetch updated data when the filter button is clicked
  };

  return (
    <div className="expenses-by-categories">
      <h3>Expenses by Categories</h3>
      <div className="date-filters">
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={handleDateChange}>Filter</button>
      </div>
      <Pie data={chartData} />
    </div>
  );
};

export default ExpensesByCategories;