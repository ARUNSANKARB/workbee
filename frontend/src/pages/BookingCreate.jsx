import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/common/Card';
import BookingForm from '../components/common/BookingForm';

const BookingCreate = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const workerId = params.get('workerId');

  const handleSuccess = (booking) => {
    // redirect to customer dashboard or booking detail
    navigate('/customer-dashboard');
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Create Booking</h2>
          <BookingForm workerId={workerId} onSuccess={handleSuccess} />
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default BookingCreate;
