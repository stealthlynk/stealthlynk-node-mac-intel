import React from 'react';

/**
 * CPU Temperature Card Component
 * Displays CPU core temperatures in a compact gauge layout
 */
const CpuTemperatureCard = ({ initialData = {} }) => {
  // Default temperatures if not provided
  const {
    core1Temp = initialData.core1 || 45,
    core2Temp = initialData.core2 || 46,
    core3Temp = initialData.core3 || 44,
    core4Temp = initialData.core4 || 47,
  } = initialData;

  // Get color based on temperature
  const getTemperatureColor = (temp) => {
    if (temp < 50) return 'text-green-500'; // Cool
    if (temp < 70) return 'text-yellow-500'; // Warm
    return 'text-red-500'; // Hot/Critical
  };

  // Get gauge fill color based on temperature
  const getGaugeFillColor = (temp) => {
    if (temp < 50) return 'bg-green-500'; 
    if (temp < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Calculate percentage for gauge fill (0-100°C range)
  const getTempPercentage = (temp) => {
    return Math.min(Math.max(temp, 0), 100);
  };

  // Render CPU core temp with gauge
  const renderCoreTemp = (coreNum, temp) => (
    <div className="flex items-center gap-2">
      <div className="w-14 text-xs whitespace-nowrap">Core {coreNum}</div>
      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getGaugeFillColor(temp)}`}
          style={{ width: `${getTempPercentage(temp)}%` }}
        ></div>
      </div>
      <div className={`text-right w-12 text-sm font-medium ${getTemperatureColor(temp)}`}>
        {temp}°C
      </div>
    </div>
  );

  // Render component
  return (
    <div className="card">
      <h3 className="card-header py-2 text-sm">CPU Temperature</h3>
      <div className="p-3 flex flex-col gap-2">
        {renderCoreTemp(1, core1Temp)}
        {renderCoreTemp(2, core2Temp)}
        {renderCoreTemp(3, core3Temp)}
        {renderCoreTemp(4, core4Temp)}
      </div>
    </div>
  );
};

export default CpuTemperatureCard;
