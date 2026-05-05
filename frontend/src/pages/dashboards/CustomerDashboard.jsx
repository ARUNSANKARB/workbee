import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import { bookingAPI } from '../../services/api';
import BookingCard from '../../components/cards/BookingCard';

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    
    try {
      const res = await bookingAPI.getAll();
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Sidebar role="customer" />
        </div>
        <div className="md:col-span-3">
          <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
          <div className="space-y-4">
            {bookings.length === 0 && <div className="text-gray-600">No bookings yet.</div>}
            {bookings.map((b) => <BookingCard key={b._id} booking={b} />)}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
