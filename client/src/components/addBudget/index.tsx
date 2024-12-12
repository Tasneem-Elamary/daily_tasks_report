import  { useState } from "react";
import './style.scss';


import { useNavigate } from "react-router-dom";

const AddBudgetForm = () => {
  const [formData, setFormData] = useState({
    categoryName: "",
    amount: 0,
    currency: "EGP",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); // React Router navigation
  const token = localStorage.getItem("token");

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
      const response = await fetch("http://localhost:3000/api/v1/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add budget");
      }

      const data = await response.json();
      setSuccessMessage("Budget added successfully!");
      console.log("Budget API Response:", data);

      // Reset the form
      setFormData({
        categoryName: "",
        amount: 0,
        currency: "EGP",
        startDate: "",
        endDate: "",
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
      <h3>Add Budget</h3>
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
        </select>
      </div>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Budget"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </form>
  );
};

export default AddBudgetForm;