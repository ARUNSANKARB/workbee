import React from 'react';
import { motion } from 'framer-motion';

const Toast = ({ notification, onClose }) => {
  if (!notification) return null;

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${colors[notification.type]} text-white px-4 py-3 rounded-lg shadow-lg`}
    >
      {notification.message}
    </motion.div>
  );
};

export default Toast;
