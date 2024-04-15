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
    center: true,
    width: 1000,
    height: 620,
    minHeight: 620,
    minWidth: 860,
    // transparent: true,
    // frame: false,
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
    alwaysOnTop: true,
    transparent: true,
    autoHideMenuBar: true,
    maximizable: false,
    show: false,
    frame: false,
    x: 1320,
    y: 850,
    width: 600,
    height: 250,
    minWidth: 600,
    minHeight: 250,
    webPreferences: {
      additionalArguments:['modalWindow'],
      webSecurity: false,
      devTools: false,
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

    let playing = false;
    let looping = false;

    let funcSaveQueue: () => void;
    
    // ipcMain.on('quit-app', () => {app.quit(); win = null});

    // ipcMain.on('minimizeModal', () => {
    //     // window.
    // })

    ipcMain.on('closeApp', () => {
        // console.log('test');
        app.quit();
    })

    ipcMain.on('togglePlaying', () => {
        playing = !playing;
        BrowserWindow.getAllWindows().forEach(window => {
            window.webContents.send('updatePlaying', playing);
        });
    })
    
    ipcMain.on('toggleLoop', () => {
        looping = !looping;
        BrowserWindow.getAllWindows().forEach(window => {
            window.webContents.send('updateLoop', looping);
        });
    })
  
    ipcMain.on('trackTitle', (_e, title) => { // get the render process from App.tsx
        modalWindow?.setTitle(title); // set the modal window title to the current track
        modalWindow?.webContents.send('trackTitle', title) // set the title track as the current track
    })

    ipcMain.on('trackThumbnail', (_e, base64) => { // get the render process from TrackThumbnail.tsx
        modalWindow?.webContents.send('trackThumbnail', base64); // set the thumbnail to the current track
    })

    ipcMain.on('tracksQueue', (_e, results) => {
        modalWindow?.webContents.send('tracksQueue', results);
    })

    ipcMain.on('trackProgressData', (_e, currentTime, progress, duration) => {
        modalWindow?.webContents.send('trackProgressData', currentTime, progress, duration);
    })

    // ipcMain.on('playNextInQueue', (_e, PlayNextInQueueString) => {
    //     try {
    //         const PlayNextInQueue = new Function('return (' + PlayNextInQueueString + ')')();
    //         PlayNextInQueue()();
    //       } catch (error) {
    //         console.error('Error executing function:', error);
    //       }
    // })
    ipcMain.on('sendSaveQueue', (_e, SaveQueue) => {
        funcSaveQueue = eval('(' + SaveQueue + ')');
    })

    ipcMain.on('callSaveQueue', (_e) => {
        funcSaveQueue();
    })
}

app.whenReady().then(() => {
  ModalWindowStuff();
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
