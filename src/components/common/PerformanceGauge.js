import React from 'react';
import GaugeComponent from 'react-gauge-component';

/**
 * PerformanceGauge component
 * Creates a modern gauge visualization for network performance metrics
 */
const PerformanceGauge = ({ 
  value = 0, 
  min = 0, 
  max = 100, 
  title = '', 
  unit = '', 
  thresholds = [33, 66],
  isLoading = false,
  animated = true
}) => {
  // Calculate the percentage of value within range
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  
  // Define color ranges
  const getColor = (percent) => {
    if (percent <= thresholds[0]) return '#10B981'; // Green
    if (percent <= thresholds[1]) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const arc = {
    width: 0.3,
    padding: 0.003,
    cornerRadius: 1,
    subArcs: [
      { limit: thresholds[0], color: '#10B981', showTick: true }, // Green zone
      { limit: thresholds[1], color: '#F59E0B', showTick: true }, // Yellow zone
      { color: '#EF4444', showTick: true } // Red zone
    ]
  };
  
  const pointer = {
    elastic: animated ? 0.5 : 0,
    animationDelay: 0
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-4">
        <div className="w-24 h-24 relative animate-pulse">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path 
              d="M 50,50 m 0,-45 a 45,45 0 1 1 0,90 a 45,45 0 1 1 0,-90" 
              stroke="#1E293B" 
              strokeWidth="10" 
              fill="none" 
            />
            <path 
              d="M 50,50 m 0,-45 a 45,45 0 0 1 0,90 a 45,45 0 0 1 0,-90" 
              stroke="#3B82F6" 
              strokeWidth="10" 
              fill="none" 
              strokeDasharray="141.37" 
              strokeDashoffset="141.37" 
              className="animate-dash"
            />
          </svg>
        </div>
        <div className="text-center mt-2">
          <div className="text-lg font-medium text-stl-blue-300">{title}</div>
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-1">
        <div className="text-lg font-medium text-gray-300">{title}</div>
      </div>
      <div className="w-full gauge-container">
        <GaugeComponent 
          id={`gauge-${title.toLowerCase().replace(/\s+/g, '-')}`}
          type="semicircle"
          value={value}
          minValue={min}
          maxValue={max}
          arc={arc}
          pointer={pointer}
          labels={{
            valueLabel: {
              formatTextValue: val => `${Math.round(val)} ${unit}`,
              style: { fontSize: '18px', fill: '#F1F5F9' }
            },
            tickLabels: {
              type: 'outer',
              ticks: [
                { value: min, label: `${min}` },
                { value: max, label: `${max}` }
              ],
              style: { fontSize: '10px', fill: '#94A3B8' }
            }
          }}
        />
      </div>
    </div>
  );
};

export default PerformanceGauge;
