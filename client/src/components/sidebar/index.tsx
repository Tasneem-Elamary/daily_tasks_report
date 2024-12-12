import './style.scss';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Finance Application</h2>
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/categories-budget">Categories Budget</Link>
        </li>
        <li>
          <Link to="/add-transaction">Add Transaction</Link>
        </li>
        <li>
          <Link to="/add-budget">Add Budget</Link>
        </li>
      </ul>
      <button className="logout-btn">Logout</button>
    </div>
  );
};

export default Sidebar;