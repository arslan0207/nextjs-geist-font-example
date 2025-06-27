const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const path = require('path')
const isDev = process.env.ELECTRON_IS_DEV === '1'
const Store = require('electron-store')

// Initialize electron store for local data persistence
const store = new Store()

let mainWindow

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    show: false,
    titleBarStyle: 'default'
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:8000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../out/index.html'))
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Create application menu
  createMenu()
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Invoice',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('navigate', '/invoices')
          }
        },
        {
          label: 'New Quotation',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            mainWindow.webContents.send('navigate', '/quotations')
          }
        },
        { type: 'separator' },
        {
          label: 'Backup Data',
          click: async () => {
            const result = await dialog.showSaveDialog(mainWindow, {
              title: 'Save Backup',
              defaultPath: `kashmir-backup-${new Date().toISOString().split('T')[0]}.json`,
              filters: [
                { name: 'JSON Files', extensions: ['json'] }
              ]
            })
            
            if (!result.canceled) {
              mainWindow.webContents.send('create-backup', result.filePath)
            }
          }
        },
        {
          label: 'Restore Data',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              title: 'Restore Backup',
              filters: [
                { name: 'JSON Files', extensions: ['json'] }
              ],
              properties: ['openFile']
            })
            
            if (!result.canceled) {
              mainWindow.webContents.send('restore-backup', result.filePaths[0])
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Dashboard',
          accelerator: 'CmdOrCtrl+D',
          click: () => {
            mainWindow.webContents.send('navigate', '/')
          }
        },
        {
          label: 'Customers',
          accelerator: 'CmdOrCtrl+U',
          click: () => {
            mainWindow.webContents.send('navigate', '/customers')
          }
        },
        {
          label: 'Projects',
          accelerator: 'CmdOrCtrl+P',
          click: () => {
            mainWindow.webContents.send('navigate', '/projects')
          }
        },
        {
          label: 'Reports',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.webContents.send('navigate', '/reports')
          }
        },
        { type: 'separator' },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.reload()
          }
        },
        {
          label: 'Force Reload',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => {
            mainWindow.webContents.reloadIgnoringCache()
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
          click: () => {
            mainWindow.webContents.toggleDevTools()
          }
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          click: () => {
            mainWindow.minimize()
          }
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          click: () => {
            mainWindow.close()
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Kashmir Carpentry LLC',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About',
              message: 'Kashmir Carpentry LLC',
              detail: 'Project Management and Invoicing System\nVersion 1.0.0\n\nBuilt with Next.js and Electron'
            })
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// Handle app events
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Handle IPC messages
ipcMain.handle('store-get', (event, key) => {
  return store.get(key)
})

ipcMain.handle('store-set', (event, key, value) => {
  store.set(key, value)
})

ipcMain.handle('store-delete', (event, key) => {
  store.delete(key)
})

ipcMain.handle('store-clear', () => {
  store.clear()
})

// Handle auto-updater (for future use)
ipcMain.handle('app-version', () => {
  return app.getVersion()
})
