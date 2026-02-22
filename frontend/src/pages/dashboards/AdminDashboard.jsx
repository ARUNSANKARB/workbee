import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminAPI.getDashboard();
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to fetch admin stats', err);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Sidebar role="admin" />
        </div>
        <div className="md:col-span-3">
          <h2 className="text-2xl font-bold mb-4">Admin Overview</h2>
          {stats ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <div className="font-semibold">Total Users</div>
                <div className="text-2xl">{stats.totalUsers}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="font-semibold">Total Bookings</div>
                <div className="text-2xl">{stats.totalBookings}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="font-semibold">Revenue</div>
                <div className="text-2xl">{stats.totalRevenue}</div>
              </div>
            </div>
          ) : (
            <div>Loading stats...</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
