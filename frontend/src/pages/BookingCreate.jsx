import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/common/Card';
import BookingForm from '../components/common/BookingForm';

const BookingCreate = () => {
  const {id} = useParams();
  const navigate = useNavigate();

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
          <BookingForm workerId={id} onSuccess={handleSuccess} />
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default BookingCreate;
