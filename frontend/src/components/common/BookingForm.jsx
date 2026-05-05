import React, { useState,useEffect} from 'react';
import Button from './Button';
import { bookingAPI, workerAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';

const BookingForm = ({ workerId, onSuccess }) => {
  const [worker,setWorker] = useState(null);

  useEffect(()=>{
    const fetchWorker = async () => {
      const res=await workerAPI.getById(workerId);
      setWorker(res.data)
    }
    fetchWorker();
  },[workerId])

  const [form, setForm] = useState({
    skills: '',
    date : '',
    address: '',
    area : '',
    time : '',
    amount: '',
  });
  const {user} = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const amount = worker?.hourlyRate;
      const payload = { ...form, skilledPersonId : workerId , status : "pending" , amount};
      const res = await bookingAPI.create(payload);
      onSuccess && onSuccess(res.data);
    } catch (err) {
      console.error('Booking failed', err);
      alert(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="grid grid-cols-2 gap-4">
        <div>
        <label className="block text-sm font-medium">Service Needed</label>
        <input type="text" name="skills" value={form.skills} onChange={handleChange} required className="w-full p-2 border rounded" />
      </div>
      
        <div>
          <label className="block text-sm font-medium">Booking Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
        <label className="block text-sm font-medium">Area</label>
        <input type="text" name="area" value={form.area} onChange={handleChange} required className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Time</label>
        <input type="time" name="time" value={form.time} onChange={handleChange} required className="w-full p-2 border rounded" />
        <p className="text-xs text-gray-500 mt-1">
           Use 24-hour format (e.g. 14:30 for 2:30 PM)
        </p>
      </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Address</label>
        <textarea name="address" value={form.address} onChange={handleChange} required className="w-full p-2 border rounded" />
      </div>

      <div className="text-right">
        <Button type="submit" loading={loading}>Confirm Booking</Button>
      </div>
    </form>
  );
};

export default BookingForm;
