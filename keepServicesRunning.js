/**
 * StealthLynk Service Protector - Main Launcher
 * 
 * This standalone script prevents macOS from putting services to sleep 
 * and ensures frpc/xray remain running even if they get terminated.
 * 
 * This is completely independent of the main application code
 * to avoid any conflicts with existing functionality.
 */

// Load the utility modules
const powerManager = require('./utils/macosPowerManager');
const serviceMonitor = require('./utils/ensureRunning');

// Simple logging
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [SERVICE-PROTECTOR] ${message}`);
}

log('StealthLynk Service Protector started');
log('This utility will prevent macOS from terminating critical services');
log('Both utilities are now running in the background');

// The monitoring and power management is already running
// from the auto-initialization in the imported modules

// Export for use in Electron main process if desired
module.exports = {
  powerManager,
  serviceMonitor
};
