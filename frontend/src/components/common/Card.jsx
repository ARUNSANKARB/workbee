import React from 'react';
import clsx from 'clsx';

const Card = ({ 
  children, 
  className, 
  onClick,
  hoverable = false,
  ...props 
}) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl p-6 shadow-card',
        hoverable && 'transition-shadow duration-200 hover:shadow-hover cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
