import  { useState } from "react";
import './style.scss';


import { useNavigate } from "react-router-dom";

const AddTransactionForm = () => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    categoryName: "",
    amount: "",
    currency: "EGP",
    transactionDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); // React Router navigation

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:3000/api/v1/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add transaction");
      }

      const data = await response.json();
      setSuccessMessage("Transaction added successfully!");
      console.log("Transaction response:", data);

      // Reset the form
      setFormData({
        categoryName: "",
        amount: "",
        currency: "EGP",
        transactionDate: "",
      });

      // Navigate to the root URL
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Transaction</h3>
      <div>
        <label>Category Name:</label>
        <input
          type="text"
          name="categoryName"
          value={formData.categoryName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Amount:</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Currency:</label>
        <select
          name="currency"
          value={formData.currency}
          onChange={handleInputChange}
        >
          <option value="EGP">EGP</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </select>
      </div>
      <div>
        <label>Transaction Date:</label>
        <input
          type="datetime-local"
          name="transactionDate"
          value={formData.transactionDate || ""}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Transaction"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </form>
  );
};

export default AddTransactionForm;
