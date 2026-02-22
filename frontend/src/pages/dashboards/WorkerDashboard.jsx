import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import { bookingAPI } from '../../services/api';
import BookingCard from '../../components/cards/BookingCard';

const WorkerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await bookingAPI.getAll({});
      // filter by worker in real app; here show all for demo
      setRequests(res.data.data.bookings || res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch worker requests', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Sidebar role="worker" />
        </div>
        <div className="md:col-span-3">
          <h2 className="text-2xl font-bold mb-4">Requests</h2>
          <div className="space-y-4">
            {loading && <div>Loading...</div>}
            {!loading && requests.length === 0 && <div className="text-gray-600">No requests yet.</div>}
            {!loading && requests.map((r) => <BookingCard key={r._id} booking={r} />)}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WorkerDashboard;
