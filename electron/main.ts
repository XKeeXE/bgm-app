import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import path from 'node:path'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
let modalWindow: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    width: 1200,
    height: 600,
    minHeight: 600,
    minWidth: 600,
    center: true,
    
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  
  modalWindow = new BrowserWindow({
    parent: win,
    modal: true,
    width: 520,
    height: 250,
    transparent: true,
    x: 1320,
    y: 440,
    autoHideMenuBar: true,
    maximizable: false,
    show: false,
    webPreferences: {
      additionalArguments:['modalWindow'],
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })
  
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    modalWindow.loadURL(VITE_DEV_SERVER_URL + 'modalWindow.html');
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'inex.html'))
    modalWindow.loadFile(path.join(process.env.DIST, 'modalWindow.html'))
    
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

function ModalWindowStuff() {
  ipcMain.on('track-title', (e, title) => { // get the render process from App.tsx
    modalWindow?.setTitle(title); // set the modal window title to the current track
  })

  ipcMain.on('track-thumbnail', (e, base64) => { // get the render process from TrackThumbnail.tsx
    modalWindow?.webContents.send('track-thumbnail', base64); // set the thumbnail to the current track
  })

}

app.whenReady().then(() => {
  ModalWindowStuff();
  modalWindow?.setMenu(null);
  globalShortcut.register('Alt+J', () => {
    if (win?.isMinimized() == true) {
      win?.show();
      win?.focus();
      // win?.
      modalWindow?.hide();
      // modalWindow?.close();
    } else {
      win?.minimize();
      win?.hide();
      modalWindow?.show();
    }
  })
}).then(createWindow)
