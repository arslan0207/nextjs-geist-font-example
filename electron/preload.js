const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Store operations
  store: {
    get: (key) => ipcRenderer.invoke('store-get', key),
    set: (key, value) => ipcRenderer.invoke('store-set', key, value),
    delete: (key) => ipcRenderer.invoke('store-delete', key),
    clear: () => ipcRenderer.invoke('store-clear')
  },
  
  // App operations
  app: {
    getVersion: () => ipcRenderer.invoke('app-version')
  },
  
  // Navigation
  onNavigate: (callback) => {
    ipcRenderer.on('navigate', (event, route) => callback(route))
  },
  
  // Backup operations
  onCreateBackup: (callback) => {
    ipcRenderer.on('create-backup', (event, filePath) => callback(filePath))
  },
  
  onRestoreBackup: (callback) => {
    ipcRenderer.on('restore-backup', (event, filePath) => callback(filePath))
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel)
  }
})

// Platform detection
contextBridge.exposeInMainWorld('platform', {
  isElectron: true,
  platform: process.platform,
  arch: process.arch
})
