import React from 'react';
import { motion } from 'framer-motion';

/**
 * MachineSpecsCard component
 * Displays detailed machine specifications with animated loading states
 */
const MachineSpecsCard = ({ specs, isLoading = false }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  // Format memory values if available
  const formatMemory = mem => {
    if (!mem) return { total: 'N/A', free: 'N/A', used: 'N/A', usagePercent: 0 };
    
    // Check if values are already in GB format (small numbers like 8, 16)
    const isAlreadyGB = mem.total < 100; // Assuming no modern computer has less than 100 bytes of RAM
    
    const total = isAlreadyGB 
      ? `${mem.total} GB`
      : typeof mem.total === 'number' 
        ? `${(mem.total / 1024 / 1024 / 1024).toFixed(2)} GB` 
        : mem.total;
        
    const free = isAlreadyGB
      ? `${mem.free} GB`
      : typeof mem.free === 'number' 
        ? `${(mem.free / 1024 / 1024 / 1024).toFixed(2)} GB` 
        : mem.free;
        
    const used = isAlreadyGB
      ? `${mem.used} GB`
      : typeof mem.used === 'number' 
        ? `${(mem.used / 1024 / 1024 / 1024).toFixed(2)} GB` 
        : mem.used;
        
    const usagePercent = mem.usage || 
      (typeof mem.used === 'number' && typeof mem.total === 'number' 
        ? Math.round((mem.used / mem.total) * 100) 
        : 0);
    
    console.log('Memory data formatted:', { total, free, used, usagePercent });
    
    return { total, free, used, usagePercent };
  };

  // Format memory data
  const memory = formatMemory(specs?.memory);

  // Loading states
  if (isLoading) {
    return (
      <div className="card">
        <h3 className="card-header">Machine Specifications</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-stl-dark-600 rounded w-3/4"></div>
          <div className="h-4 bg-stl-dark-600 rounded w-1/2"></div>
          <div className="h-4 bg-stl-dark-600 rounded w-5/6"></div>
          <div className="h-4 bg-stl-dark-600 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="card"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="card-header">Machine Specifications</h3>
      
      <div className="space-y-2">
        {/* CPU Information */}
        <motion.div variants={itemVariants} className="space-y-0.5">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Processor</span>
            <span className="text-sm font-medium bg-stl-dark-600 px-2 py-0.5 rounded">
              {specs?.cpu?.cores || 0} Cores
            </span>
          </div>
          <div className="text-md font-medium">{specs?.cpu?.model || 'Unknown CPU'}</div>
          <div className="text-sm text-gray-400">
            {specs?.cpu?.speed ? `${specs.cpu.speed} GHz` : ''}
          </div>
        </motion.div>
        
        {/* Memory Information */}
        <motion.div variants={itemVariants} className="space-y-0.5">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Memory</span>
          </div>
          <div className="text-md font-medium">{memory.total} Total</div>
        </motion.div>
        
        {/* Operating System */}
        <motion.div variants={itemVariants} className="space-y-0.5">
          <div className="text-gray-400 text-sm">Operating System</div>
          <div className="text-md font-medium">{specs?.os?.distro || 'Unknown OS'}</div>
          <div className="text-sm text-gray-400">
            {specs?.os?.release} {specs?.os?.arch ? `(${specs.os.arch})` : ''}
          </div>
        </motion.div>
        
        {/* Network Information */}
        <motion.div variants={itemVariants} className="space-y-0.5">
          <div className="text-gray-400 text-sm">Network</div>
          <div className="text-md font-medium truncate">
            {specs?.network?.externalIp || 'IP Not Available'}
          </div>
          <div className="text-sm text-gray-400">
            {specs?.network?.hostname || 'Hostname Not Available'}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MachineSpecsCard;
