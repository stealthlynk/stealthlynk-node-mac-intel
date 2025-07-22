import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoNew from '../assets/icons/logo-new.PNG';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab, services = {} }) => {
  // Navigation items
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    }
  ];

  // Animation variants
  const sidebarVariants = {
    expanded: { width: '230px' }
  };

  return (
    <motion.div
      className="flex-none bg-stl-dark-800 border-r border-stl-dark-600 shadow-stl overflow-x-hidden"
      style={{ width: '230px' }}
      variants={sidebarVariants}
      initial="expanded"
      animate="expanded"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center h-14 border-b border-stl-dark-600">
          {/* Left space to account for standard buttons */}
          <div className="w-16"></div>
          
          {/* Text centered between standard buttons and right edge */}
          <div className="flex-1 flex items-center justify-center">
            <span className="text-xl font-semibold pt-1">
              <span className="text-green-500">Stealth</span>
              <span className="text-white">Lynk</span>
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              className={`flex items-center w-full px-3 py-3 text-lg font-medium ${activeTab === item.id ? 'text-green-400 font-medium' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab(item.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg
                className={`w-6 h-6 mr-3 ${activeTab === item.id ? 'text-green-400' : 'text-gray-500'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>

              <span className="truncate">{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Services Status */}
        <div className="px-4 py-3 border-t border-stl-dark-600">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Services</h3>
          <div className="space-y-2">
            {/* SLT Service */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span className="text-sm text-gray-300">SLT Service</span>
              </div>
              <span className={`px-2 py-0.5 text-xs rounded-full ${services.slt?.status === 'running' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                {services.slt?.status === 'running' ? 'Running' : 'Stopped'}
              </span>
            </div>
            
            {/* SLR Service */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm text-gray-300">SLR Service</span>
              </div>
              <span className={`px-2 py-0.5 text-xs rounded-full ${services.slr?.status === 'running' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                {services.slr?.status === 'running' ? 'Running' : 'Stopped'}
              </span>
            </div>
          </div>
        </div>

        {/* App Version */}
        <div className="p-4 border-t border-stl-dark-600 text-center">
          <div className="text-xs text-gray-500">v1.0.0</div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
