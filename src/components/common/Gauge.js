import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const Gauge = ({ value = 0, max = 100, color = '#1a91ff', showValue = true, label }) => {
  // Ensure value is within bounds
  const normalizedValue = Math.min(Math.max(0, value), max);
  const percentage = (normalizedValue / max) * 100;
  
  // Color based on percentage
  const getColor = () => {
    if (color) return color;
    
    if (percentage > 80) return '#10B981'; // Green
    if (percentage > 50) return '#1a91ff'; // Blue
    if (percentage > 30) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };
  
  // Chart data
  const data = {
    datasets: [
      {
        data: [normalizedValue, max - normalizedValue],
        backgroundColor: [getColor(), '#374151'],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      },
    ],
  };
  
  // Chart options
  const options = {
    cutout: '75%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  
  return (
    <div className="gauge-container">
      <div className="gauge">
        <Doughnut data={data} options={options} />
        {showValue && (
          <div className="gauge-value">
            <span>{Math.round(value)}</span>
            {label && <span className="text-sm text-gray-400 block">{label}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gauge;
