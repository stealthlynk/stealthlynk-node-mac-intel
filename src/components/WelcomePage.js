import React from 'react';
import logoNew from '../assets/icons/logo-new.PNG';

const WelcomePage = ({ onContinue }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-stl-dark-900">
      <div className="p-10 bg-stl-dark-800 rounded-lg shadow-2xl max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={logoNew} 
            alt="StealthLynk" 
            className="w-24 h-24 object-contain"
          />
        </div>
        
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            <span className="text-green-500">Stealth</span>
            <span className="text-white">Lynk</span>
          </h1>
          <p className="text-gray-400">Secure and private connection management</p>
        </div>
        
        {/* Welcome message */}
        <div className="mb-8 text-center">
          <p className="text-gray-300 mb-4">
            Welcome to StealthLynk, your secure VPN solution for enhanced privacy and security.
          </p>
          <p className="text-gray-300">
            With StealthLynk, you can manage your connections and monitor your service performance all in one place.
          </p>
        </div>
        
        {/* Continue button */}
        <div className="flex justify-center">
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
