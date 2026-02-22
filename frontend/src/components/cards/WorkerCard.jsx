import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiDollarSign } from 'react-icons/fi';
import Card from '../common/Card';

const WorkerCard = ({ worker }) => {
  return (
    <Link to={`/worker/${worker.userId._id}`}>
      <Card hoverable className="h-full">
        <div className="flex gap-4">
          {/* Image */}
          <img 
            src={worker.userId.profileImage} 
            alt={worker.userId.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          
          {/* Info */}
          <div className="flex-1">
            <h3 className="font-bold text-lg text-dark">{worker.userId.name}</h3>
            
            {/* Skills */}
            <p className="text-sm text-gray-600 truncate">{worker.skills?.join(', ')}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <FiStar className="w-4 h-4 text-primary fill-primary" />
                <span className="font-semibold text-sm">{worker.ratings?.average?.toFixed(1) || 'New'}</span>
              </div>
              <span className="text-xs text-gray-500">({worker.ratings?.count || 0} reviews)</span>
            </div>

            {/* Rate */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1 text-primary font-bold">
                <FiDollarSign className="w-4 h-4" />
                <span>{worker.serviceRate}/hr</span>
              </div>
              {worker.location?.address && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <FiMapPin className="w-3 h-3" />
                  <span className="truncate">{worker.location.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default WorkerCard;
