import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ role = 'customer' }) => {
  return (
    <aside className="w-64 bg-white p-4 rounded-lg shadow">
      <nav className="space-y-2">
        {role === 'customer' && (
          <>
            <Link to="/customer-dashboard" className="block p-2 rounded hover:bg-light">My Bookings</Link>
            <Link to="/services" className="block p-2 rounded hover:bg-light">Browse Services</Link>
          </>
        )}

        {role === 'worker' && (
          <>
            <Link to="/worker-dashboard" className="block p-2 rounded hover:bg-light">Requests</Link>
            <Link to="/worker-dashboard/earnings" className="block p-2 rounded hover:bg-light">Earnings</Link>
          </>
        )}

        {role === 'admin' && (
          <>
            <Link to="/admin-dashboard" className="block p-2 rounded hover:bg-light">Overview</Link>
            <Link to="/admin-dashboard/workers" className="block p-2 rounded hover:bg-light">Pending Workers</Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
