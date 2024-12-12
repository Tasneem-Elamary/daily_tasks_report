import './style.scss';

import TransactionsHistory from "../transactionHisory";
import ExpensesByCategories from "../expensesPiechart";

const Dashboard= () => {
  return (
    
        
        <div className="content-sections">
          <TransactionsHistory />
          <ExpensesByCategories />
        </div>
     
  );
};

export default Dashboard;