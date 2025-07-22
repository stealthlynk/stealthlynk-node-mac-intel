import React from 'react';
import { motion } from 'framer-motion';

const StatusCard = ({ title, status, detail, icon, children }) => {
  // Map status to color
  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
      case 'active':
        return 'bg-green-500';
      case 'partial':
        return 'bg-yellow-500';
      case 'stopped':
      case 'inactive':
        return 'bg-red-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  return (
    <motion.div
      className="card"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-start">
        <div className={`p-3 rounded-lg ${status ? getStatusColor(status) + ' bg-opacity-20' : 'bg-indigo-500 bg-opacity-20'}`}>
          {icon || (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        
        <div className="ml-4 flex-grow">
          <h3 className="text-lg font-medium mb-1">{title}</h3>
          <p className="text-gray-400 text-sm">{detail}</p>
          
          {children && (
            <div className="mt-3">
              {children}
            </div>
          )}
        </div>
        
        {status && (
          <div className="ml-2">
            <span className={`inline-flex h-3 w-3 rounded-full ${getStatusColor(status)}`}></span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatusCard;
