import React, { useState } from 'react';
import Button from './Button';
import { bookingAPI } from '../../services/api';

const BookingForm = ({ workerId, onSuccess }) => {
  const [form, setForm] = useState({
    serviceDescription: '',
    bookingDate: '',
    estimatedCompletionDate: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, workerId };
      const res = await bookingAPI.create(payload);
      onSuccess && onSuccess(res.data.data.booking || res.data.data);
    } catch (err) {
      console.error('Booking failed', err);
      alert(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Service Description</label>
        <textarea name="serviceDescription" value={form.serviceDescription} onChange={handleChange} required className="w-full p-2 border rounded" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Booking Date</label>
          <input type="date" name="bookingDate" value={form.bookingDate} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Estimated Completion</label>
          <input type="date" name="estimatedCompletionDate" value={form.estimatedCompletionDate} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Amount (INR)</label>
        <input type="number" name="amount" value={form.amount} onChange={handleChange} required className="w-full p-2 border rounded" />
      </div>

      <div className="text-right">
        <Button type="submit" loading={loading}>Confirm Booking</Button>
      </div>
    </form>
  );
};

export default BookingForm;
