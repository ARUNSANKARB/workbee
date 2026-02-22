import React from 'react';

const Skeleton = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div className={`skeleton ${width} ${height} ${className}`} />
);

export default Skeleton;
