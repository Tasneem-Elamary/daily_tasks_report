import './style.scss';
import  { useState,useEffect } from "react";

const TransactionsHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:3000/api/v1/transaction", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTransactions(data); // Assuming API returns an array of transactions
        } else {
          console.error("Failed to fetch transactions");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="transactions-history">
      <h3>Transactions</h3>
      <table>
        <thead>
          <tr>
            <th>Transacton Date</th>
            <th>Category</th>
            <th>Amount</th>
            
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{new Date(transaction.transactionDate).toLocaleString()}</td>
              <td>{transaction.category.name}</td>
              <td>{`${transaction.amount} ${transaction.currency}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsHistory;