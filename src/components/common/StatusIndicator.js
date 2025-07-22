import React from 'react';

/**
 * StatusIndicator component that visualizes connection status
 */
const StatusIndicator = ({ status, label, className = '', size = 'md' }) => {
  // If status is 'stopped' and it's the initial app load, show loading state
  const isInitialLoad = status === 'disconnected' || status === 'stopped';
  const isAppJustStarted = performance.now() < 10000; // First 10 seconds of app runtime
  const showLoading = isInitialLoad && isAppJustStarted;

  // Determine the color and animation based on status
  let statusColor = '';
  let animation = '';
  
  if (showLoading) {
    statusColor = 'bg-white';
    animation = 'animate-pulse';
  } else if (status === 'loading') {
    statusColor = 'bg-white';
    animation = 'animate-pulse';
  } else {
    switch (status) {
      case 'connected':
        statusColor = 'bg-green-500';
        break;
      case 'disconnected':
      case 'stopped':
        statusColor = 'bg-red-500';
        break;
      case 'restarting':
        statusColor = 'bg-yellow-400';
        animation = 'animate-ping';
        break;
      case 'initializing':
        statusColor = 'bg-blue-400';
        animation = 'animate-pulse';
        break;
      default:
        statusColor = 'bg-gray-400';
    }
  }

  // Determine the size - ensure equal width/height for perfect circles
  const sizeClass = size === 'sm' ? 'h-2 w-2' : 'w-3 h-3';

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${sizeClass} rounded-full ${statusColor} ${animation}`} style={{ borderRadius: '50%', aspectRatio: '1/1', minWidth: size === 'sm' ? '8px' : '12px', minHeight: size === 'sm' ? '8px' : '12px' }} />
      {label && (
        <span className="ml-2 font-medium">
          {label}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
