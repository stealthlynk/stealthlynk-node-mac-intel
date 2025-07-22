import React, { useState, useEffect } from 'react';

// Components
import Sidebar from './Sidebar';
import ServerHeader from './ServerHeader';
import ServerDashboard from './ServerDashboard';
import Security from './Security';
import Modal from './common/Modal';
import FirstTimeSetup from './FirstTimeSetup';

const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };

function NewApp() {
  // State
  const [appState, setAppState] = useState({
    services: {
      slt: { status: 'stopped', running: false },
      slr: { status: 'stopped', running: false }
    },
    stats: {
      uptime: { hours: 0, minutes: 0 },
      totalUptime: 0,
      totalClients: 0,
      configuredClients: 150,
      activeClients: 1,
      pingMs: 0,
      jitterMs: 0,
      downloadMbps: 0,
      uploadMbps: 0,
      lastTestTime: null,
      systemInfo: {
        // Empty initial values - will be populated from IPC calls
        cpuModel: '',
        cpuCores: 0,
        totalMemory: '',
        osType: '',
        arch: '',
        publicIp: ''
      }
    },
    clients: []
  });
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [needsFirstTimeSetup, setNeedsFirstTimeSetup] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashMinTimeDone, setSplashMinTimeDone] = useState(false);
  const [setupCheckDone, setSetupCheckDone] = useState(false);

  // Start splash minimum timer immediately
  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setSplashMinTimeDone(true);
    }, 3000); // 3 seconds minimum splash
    return () => clearTimeout(splashTimeout);
  }, []);

  // Start first-time setup check immediately
  useEffect(() => {
    const checkInitialConfig = async () => {
      if (window.electronAPI) {
        try {
          // First, try using the dedicated check-first-time-setup handler
          if (window.electronAPI.checkFirstTimeSetup) {
            const result = await window.electronAPI.checkFirstTimeSetup();
            console.log('First-time setup check result:', result);
            // Handle both possible return formats (boolean or object)
            if (typeof result === 'object' && result !== null) {
              if (result.needsSetup) {
                setNeedsFirstTimeSetup(true);
              }
            } else if (result === true) {
              setNeedsFirstTimeSetup(true);
            }
          }
          // Fallback: check via getInitialConfig
          if (window.electronAPI.getInitialConfig) {
            const config = await window.electronAPI.getInitialConfig();
            if (!config || !config.uuid || Object.keys(config).length === 0) {
              setNeedsFirstTimeSetup(true);
            }
          }
        } catch (error) {
          console.error('Failed to check first-time setup status:', error);
          setNeedsFirstTimeSetup(true);
        }
      }
      setSetupCheckDone(true);
    };
    checkInitialConfig();
  }, []);

  // Hide splash only after both splashMinTimeDone and setupCheckDone
  useEffect(() => {
    if (splashMinTimeDone && setupCheckDone) {
      setShowSplash(false);
      // Notify main process that renderer is ready (after splash)
      if (window && window.electron && window.electron.ipcRenderer) {
        window.electron.ipcRenderer.send('renderer-ready');
      } else if (window.electronAPI && window.electronAPI.send) {
        window.electronAPI.send('renderer-ready');
      }
    }
  }, [splashMinTimeDone, setupCheckDone]);

  // Fetch data periodically
  useEffect(() => {
    // Fetch system data and service status
    const fetchSystemData = async () => {
      if (window.electronAPI && window.electronAPI.getSystemInfo) {
        try {
          const systemInfo = await window.electronAPI.getSystemInfo();
          const serviceStatus = await window.electronAPI.getServiceStatus();
          
          // Get client counts directly instead of triggering an update
          if (window.electronAPI.getClientCounts) {
            try {
              const counts = await window.electronAPI.getClientCounts();
              console.log('Retrieved client counts:', counts);
              
              // Update the state with counts
              setAppState(prevState => ({
                ...prevState,
                stats: {
                  ...prevState.stats,
                  totalClients: counts.totalClients,
                  activeClients: counts.activeClients
                }
              }));
            } catch (err) {
              console.log('Could not get client counts:', err);
            }
          }
          
          // Get uptime data
          if (window.electronAPI && window.electronAPI.getUptimeData) {
            try {
              const uptimeData = await window.electronAPI.getUptimeData();
              console.log('Retrieved uptime data:', uptimeData);
              
              // Convert seconds to minutes for the UI
              const totalUptimeMinutes = Math.floor(uptimeData.totalUptime / 60);
              
              // Update state with uptime values
              setAppState(prevState => ({
                ...prevState,
                stats: {
                  ...prevState.stats,
                  totalUptime: totalUptimeMinutes
                }
              }));
            } catch (err) {
              console.error('Could not get uptime data:', err);
            }
          }
          
          // Enhanced debugging for service status
          console.log('Service status update received FULL OBJECT:', JSON.stringify(serviceStatus, null, 2));
          console.log('SLT (frpc) status object:', serviceStatus?.status?.frpc);
          console.log('SLR (xray) status object:', serviceStatus?.status?.xray);
          console.log('SLT running state:', serviceStatus?.status?.frpc?.running);
          setAppState(prevState => ({
            ...prevState,
            services: {
              slt: serviceStatus && serviceStatus.status && serviceStatus.status.frpc ? {
                status: serviceStatus.status.frpc.status || 'stopped',
                running: serviceStatus.status.frpc.running === true
              } : prevState.services.slt,
              slr: serviceStatus && serviceStatus.status && serviceStatus.status.xray ? {
                status: serviceStatus.status.xray.status || 'stopped',
                running: serviceStatus.status.xray.running === true
              } : prevState.services.slr
            },
            stats: {
              ...prevState.stats,
              systemInfo: systemInfo || prevState.stats.systemInfo
            }
          }));
        } catch (error) {
          console.error('Error fetching system data:', error);
        }
      }
    };
    
    // Set up listener for client count updates
    const setupClientCountsListener = () => {
      if (window.electronAPI && window.electronAPI.onClientCountsUpdated) {
        // Remove any existing listener first
        if (window.electronAPI.removeAllListeners) {
          window.electronAPI.removeAllListeners('client-counts-updated');
        }
        
        // Add new listener for client counts updates
        window.electronAPI.onClientCountsUpdated((data) => {
          console.log('Received client count update:', data);
          setAppState(prevState => ({
            ...prevState,
            stats: {
              ...prevState.stats,
              totalClients: data.totalClients,
              activeClients: data.activeClients
            }
          }));
        });
      }
    };
    
    // Setup client counts listener
    setupClientCountsListener();
    
    // Dedicated function to update client counts
    const updateClientCounts = async () => {
      if (window.electronAPI && window.electronAPI.getClientCounts) {
        try {
          const counts = await window.electronAPI.getClientCounts();
          console.log('Client counts refreshed:', counts);
          
          // Update app state with the counts
          setAppState(prevState => ({
            ...prevState,
            stats: {
              ...prevState.stats,
              totalClients: counts.totalClients,
              activeClients: counts.activeClients
            }
          }));
        } catch (err) {
          console.log('Error refreshing client counts:', err);
        }
      }
    };
    
    // Force an immediate service status check with extra logging
    const forceServiceCheck = async () => {
      console.log('FORCE CHECKING SERVICE STATUS');
      if (window.electronAPI && window.electronAPI.getServiceStatus) {
        try {
          const status = await window.electronAPI.getServiceStatus();
          console.log('FORCED SERVICE STATUS CHECK RESULT:', JSON.stringify(status, null, 2));
          // Explicitly update the UI with service status
          setAppState(prevState => ({
            ...prevState,
            services: {
              slt: status && status.status && status.status.frpc ? {
                status: status.status.frpc.status || 'stopped',
                running: status.status.frpc.running === true
              } : prevState.services.slt,
              slr: status && status.status && status.status.xray ? {
                status: status.status.xray.status || 'stopped',
                running: status.status.xray.running === true
              } : prevState.services.slr
            }
          }));
        } catch (err) {
          console.error('Error in forced service check:', err);
        }
      }
    };
    
    // Make the force check function available globally for debugging
    window.forceServiceCheck = forceServiceCheck;
    
    // Initial fetches
    fetchSystemData();
    updateClientCounts(); // Immediate first client count update
    forceServiceCheck(); // Force an immediate service status check
    
    // Set up intervals
    const dataInterval = setInterval(fetchSystemData, 10000);
    const clientCountsInterval = setInterval(updateClientCounts, 3000); // Refresh client counts every 3 seconds
    
    return () => {
      clearInterval(dataInterval);
      clearInterval(clientCountsInterval);
    };
  }, []);

  // Reset config function
  const resetConfig = async () => {
    try {
      setIsResetting(true);

      if (window.electronAPI && window.electronAPI.resetConfig) {
        await window.electronAPI.resetConfig();
      }

      setTimeout(() => {
        alert('StealthLynk configuration has been reset successfully.');
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Failed to reset configuration:', error);
      alert('Failed to reset configuration: ' + error.message);
    } finally {
      setIsResetting(false);
    }
  };

  // Render splash screen if showing
  if (showSplash) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-stl-dark-900 z-50">
        <div className="text-center">
          <div className="mx-auto mb-6 text-3xl font-bold">
            <span className="text-green-500">Stealth</span><span className="text-white">Lynk</span>
          </div>
          <p className="text-green-500 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  // Render first-time setup if needed
  if (needsFirstTimeSetup) {
    return (
      <FirstTimeSetup 
        onSetupComplete={() => {
          setNeedsFirstTimeSetup(false);
          // Notify main process that setup is complete
          if (window && window.electron && window.electron.ipcRenderer) {
            window.electron.ipcRenderer.send('setup-complete');
          } else if (window.electronAPI && window.electronAPI.send) {
            window.electronAPI.send('setup-complete');
          }
          // Optionally, refetch config or data here
        }}
      />
    );
  }

  // Main app UI
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-stl-dark-800 text-white">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        services={appState.services} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Server Header with Tabs */}
        <ServerHeader 
          serverId="62757"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-stl-dark-800 flex flex-col h-full">
          {/* Overview/Dashboard */}
          {(activeTab === 'overview' || activeTab === 'dashboard') && (
            // Prepare stats with callback for speed test updates
            <>{(() => {
              const statsWithCallbacks = {
                ...appState.stats,
                onSpeedTestComplete: (testResults) => {
                  console.log('Speed test completed with results:', testResults);
                  // Update the app state with the new speed test results
                  setAppState(prevState => ({
                    ...prevState,
                    stats: {
                      ...prevState.stats,
                      pingMs: testResults.ping,
                      jitterMs: testResults.jitter,
                      downloadMbps: testResults.download,
                      uploadMbps: testResults.upload,
                      lastTestTime: testResults.lastTestTime
                    }
                  }));
                }
              };
              
              // Pass the enhanced stats to the dashboard
              return (
                <ServerDashboard stats={statsWithCallbacks} />
              );
            })()}</>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <Security />
          )}
        </div>
      </div>

      {/* Reset Modal */}
      <Modal
        isOpen={isResetModalOpen}
        title="Reset Configuration"
        onClose={() => setIsResetModalOpen(false)}
        confirmText="Reset"
        cancelText="Cancel"
        onConfirm={resetConfig}
        isProcessing={isResetting}
      >
        <p>
          Are you sure you want to reset your StealthLynk configuration? This will:
        </p>
        <ul className="list-disc list-inside my-3 space-y-1">
          <li>Delete all configuration files</li>
          <li>Stop all running services</li>
          <li>Restart the app</li>
        </ul>
        <p className="text-red-500">
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export default NewApp;
