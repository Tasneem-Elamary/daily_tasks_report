import { useState, useEffect } from "react";
import "./style.scss"; // SCSS for styling

const BudgetExpense = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categories, setCategories] = useState([]); // State to hold categories data
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [error, setError] = useState(""); // State to manage errors

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    console.log(startDate)
    console.log(endDate)
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/budget/expenses?selectedStartDate=${startDate}&selectedEndDate=${endDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial render when valid start and end dates are provided
  useEffect(() => {
    fetchCategories();

  }, []);

  return (
    <div className="budget-expense">
      <h2>Categories Budget</h2>
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
        <button onClick={fetchCategories}>Filter</button>
      </div>

      {/* Loading and Error Messages */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Render Categories */}
      <div className="category-cards">
        {categories.map((category, index) => (
          <div
            key={index}
            className="category-card"
            style={{
              backgroundColor:
                category.progress >= 100
                  ? "#F28B82" // Red for overspending
                  : "#A0D8F1", // Default light blue
            }}
          >
            <div className="icon">📊</div>
            <h4>{category.categoryName}</h4>
            <p>
              {category.budgetCurrency}
              {category.budgetAmount || 0}.00
              {category.startDate && category.endDate
                ? ` (from ${new Date(category.startDate).toLocaleDateString()} to ${new Date(category.endDate).toLocaleDateString()})`
                : ''}
            </p>
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${Math.min(category.progress || 0, 100)}%`,
                  backgroundColor:
                    category.progress > 100 ? "red" : "green", // Green if within budget
                }}
              ></div>
            </div>
            <p>
              Spent {category.budgetCurrency}{category.totalExpenses} from {category.budgetCurrency}
              {category.budgetAmount || "0"}
            </p>
            <p className="status">
              {category.progress >= 100 ? "Oops!" : "Good Job!"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetExpense;