import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [machineId, setMachineId] = useState('');
  const dropdownRef = useRef(null);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close dropdown when mouse leaves the dropdown area
  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };
  
  // Get the machine UUID
  useEffect(() => {
    // Get machine UUID from the electron API if available
    if (window.electronAPI && window.electronAPI.getMachineId) {
      window.electronAPI.getMachineId().then(id => {
        setMachineId(id || 'unknown-device');
      }).catch(() => {
        setMachineId('unknown-device');
      });
    }
  }, []);
  
  // Shut down the application
  const shutDownApp = () => {
    if (window.electronAPI && window.electronAPI.quit) {
      window.electronAPI.quit();
    } else {
      console.log('Quit function not available');
      // As a fallback for browsers, we'll close the window
      window.close();
    }
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-stl-dark-800 border-b border-stl-dark-600 shadow-stl z-10" style={{ WebkitAppRegion: 'drag' }}>
      <div className="flex justify-between items-center" style={{ height: '54px' }}>
        {/* Left section for macOS window buttons, 78px is the standard width for traffic light buttons area */}
        <div style={{ width: '78px' }}></div>
        
        {/* Center section with StealthLynk text, positioned directly in the center */}
        <div className="flex-grow flex justify-center items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-stl-blue-400 flex items-center justify-center">
            <span className="text-background font-bold text-sm">SL</span>
          </div>
          <div className="text-xl font-bold text-white text-center">
            <span className="text-stl-blue-400">Stealth</span>
            <span className="text-white">Lynk</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center space-x-1 text-gray-400 hover:text-white focus:outline-none" 
              onClick={toggleDropdown}
              style={{ WebkitAppRegion: 'no-drag' }}
            >
              <svg className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="text-stl-blue-400" viewBox="0 0 24 24" style={{ color: '#1a93ff' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  className="absolute right-0 mt-2 w-48 bg-stl-dark-800 rounded-lg shadow-xl border border-stl-dark-600 py-1 z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="px-4 py-2 border-b border-stl-dark-600">
                    <p className="text-sm font-medium text-white">Machine UUID</p>
                    <p className="text-xs text-gray-400 truncate">{machineId}</p>
                  </div>
                  
                  <div className="py-1">                    
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-stl-dark-600 transition-colors"
                      onClick={shutDownApp}
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Shut Down
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
