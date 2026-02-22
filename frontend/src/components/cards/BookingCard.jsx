import React from 'react';
import Card from '../common/Card';
import { FiCalendar, FiClock } from 'react-icons/fi';

const BookingCard = ({ booking }) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between">
        <div>
          <div className="font-semibold">{booking.serviceDescription}</div>
          <div className="text-sm text-gray-500">Worker: {booking.workerName || booking.worker?.userId?.name}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500"><FiCalendar className="inline mr-1"/>{new Date(booking.bookingDate).toLocaleDateString()}</div>
          <div className="text-sm text-gray-500"><FiClock className="inline mr-1"/>{booking.status}</div>
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;
