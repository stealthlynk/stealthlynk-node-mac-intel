import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MachineSpecsCard from './common/MachineSpecsCard';
import ClientSubscriptionCard from './common/ClientSubscriptionCard';
import NetworkPerformance from './common/NetworkPerformance';
import UptimeDisplay from './common/UptimeDisplay';
import CpuTemperatureCard from './common/CpuTemperatureCard';

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

const Dashboard = ({ state = {} }) => {
  const { services = {}, stats = {}, clients = [] } = state;
  const [serverName, setServerName] = useState('');

  // Fetch serverName from initial-config
  useEffect(() => {
    const fetchServerName = async () => {
      try {
        // Use electronAPI to get initial config from the main process
        if (window.electronAPI && window.electronAPI.getInitialConfig) {
          console.log('Fetching initial config...');
          const config = await window.electronAPI.getInitialConfig();
          console.log('Initial config:', config);
          if (config && config.serverName) {
            console.log('Setting server name:', config.serverName);
            setServerName(config.serverName);
          }
        } else {
          console.warn('electronAPI.getInitialConfig not available');
        }
      } catch (error) {
        console.error('Error fetching server name:', error);
      }
    };

    fetchServerName();
  }, []);

  // Format data for components
  const machineSpecs = stats.systemInfo || {};
  const totalClients = stats.totalClients || 0;
  const configuredClients = stats.configuredClients || 0;
  const activeClients = stats.activeClients || 0;

  // Log client counts for debugging
  console.debug(`Dashboard rendering with totalClients: ${totalClients}, configuredClients: ${configuredClients}, activeClients: ${activeClients}`);

  // Service states
  const sltStatus = services.slt?.status || 'disconnected';
  const slrStatus = services.slr?.status || 'disconnected';

  return (
    <motion.div
      className="p-1 pt-0 max-h-screen overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center mb-3 mt-0">
        <h1 className="text-2xl font-bold">
          StealthLynk {serverName || 'Server'}
        </h1>
      </div>

      {/* Status Overview */}
      <motion.div variants={itemVariants} className="mb-4">
        <div className="flex items-center mb-1">
          <h2 className="text-lg font-semibold">Status Overview</h2>
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-stl-blue-500 text-white">
            {machineSpecs.uuid ? `Node ${machineSpecs.uuid.substring(0, 8)}` : 'Local Node'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
          {/* Client Subscriptions */}
          <ClientSubscriptionCard
            clients={clients}
            totalClients={totalClients}
            configuredClients={configuredClients}
            activeClients={activeClients}
            isLoading={false}
          />

          {/* Machine Specifications */}
          <MachineSpecsCard
            specs={machineSpecs}
          />
          
          {/* Uptime */}
          <div className="card">
            <h3 className="card-header">Uptime</h3>
            <UptimeDisplay uptime={stats.uptime} totalUptime={stats.totalUptime} />
          </div>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div variants={itemVariants} className="mb-2">
        <h2 className="text-xl font-semibold mb-2">Performance Metrics</h2>

        <div className="grid grid-cols-1 gap-6">
          {/* Network Performance */}
          <NetworkPerformance 
            initialData={{
              ping: stats.pingMs || 0,
              jitter: stats.jitterMs || 0,
              download: stats.downloadMbps || 0,
              upload: stats.uploadMbps || 0
            }}
          />
          
          {/* CPU Temperature */}
          <CpuTemperatureCard 
            initialData={{
              core1: stats.cpuTemp1 || 45,
              core2: stats.cpuTemp2 || 46,
              core3: stats.cpuTemp3 || 44,
              core4: stats.cpuTemp4 || 47
            }}
          />
        </div>
      </motion.div>

      {/* Inactive Clients */}
      <motion.div variants={itemVariants} style={{display: 'none'}}>
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="card-header !mb-0">Inactive Clients</h3>
            <button className="text-sm text-stl-blue-400 hover:text-stl-blue-300 flex items-center">
              <span className="mr-1">View All</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stl-dark-600">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Connected Since</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stl-dark-700">
                {clients && clients.length > 0 ? (
                  clients
                    .filter(client => !(client.active || client.isActive)) // Filter out active clients
                    .map((client, index) => (
                    <tr key={client.uuid || index} className={index % 2 === 0 ? 'bg-stl-dark-700/30' : ''}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-stl-dark-500 flex items-center justify-center text-stl-blue-400">
                            C
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">Client</div>
                            <div className="text-sm text-gray-500 truncate max-w-[150px]">
                              {client.uuid ? client.uuid.substring(0, 8) + '...' : 'Unknown'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{client.date || client.connectedDate || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900/20 text-red-400">
                          Idle
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                      No inactive clients found
                    </td>
                  </tr>
                )}
                {clients && clients.length > 0 && clients.filter(client => !(client.active || client.isActive)).length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                      No inactive clients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
