import { app, BrowserWindow, dialog, ipcMain, nativeTheme } from 'electron'
import path from 'node:path'
import fs from 'fs';
import { loadEsm } from 'load-esm';
import ytdl from 'ytdl-core';
import { Track } from '../src/interfaces/store/player';

// The built directory structure

// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

const FORMATS = ['.mp3', '.ogg', '.wav', '.WAV', '.aac', '.m4a', '.flac', '.aiff'];
const QUEUE_FILE = "BGMQUEUE.txt";
const SETTING_FILE = 'Settings.txt'
// const isDev = app.isPackaged;

const DEFAULTS = {
	language: 'en',
	homePath: '',
	darkMode: nativeTheme.shouldUseDarkColors,
	viewportHeight: 620,
	viewportWidth: 860,
	volume: 0.8,
	maxSaveTimer: 5,
}

let savedSettings = DEFAULTS;
let main: BrowserWindow | null
let player: BrowserWindow | null

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
	main = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, 'bgmapp.ico'),
		center: true,
		height: savedSettings.viewportHeight,
		width: savedSettings.viewportWidth,
		minHeight: 620,
		minWidth: 860,
		titleBarStyle: 'hidden',
		// frame: false,
		// darkTheme: savedSettings.darkMode,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			nodeIntegrationInWorker: true,
			preload: path.join(__dirname, 'preload.js'),
		},
	})

	player = new BrowserWindow({
		minHeight: 0,
		minWidth: 0,
		show: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			webSecurity: false,
		}
	})

	// Test active push message to Renderer-process.
	main.webContents.on('did-finish-load', () => {
		main?.webContents.send('loaded', savedSettings);
	})

	player.webContents.on('did-finish-load', () => {
		player?.webContents.send('loaded', savedSettings.volume);
	})

	main.webContents.on('destroyed', () => {
		app.exit();
	})

	player.webContents.on('destroyed', () => {
		app.exit();
	})

	if (VITE_DEV_SERVER_URL) {
		main.loadURL(VITE_DEV_SERVER_URL)
		player.loadURL(VITE_DEV_SERVER_URL + 'player.html')
	} else {
		main.loadFile(path.join(__dirname, '../dist/index.html'))
		player.loadFile(path.join(__dirname, '../dist/player.html'))
	}
}


async function loadSettings() {
	try {
		savedSettings = JSON.parse(await fs.promises.readFile(SETTING_FILE, 'utf-8'))
	} catch (error) {
		console.error('Error reading settings:', error);
		savedSettings = DEFAULTS;
		SaveSettings();
	}
	savedSettings.darkMode ? nativeTheme.themeSource = 'dark' :  nativeTheme.themeSource = 'light'
}

async function SaveSettings() {
	await fs.promises.writeFile(SETTING_FILE, JSON.stringify(savedSettings), 'utf-8')
}

//#region *------------------App------------------------*

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
		main = null
		player = null
	}
})

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

app.whenReady().then(async () => {
	loadSettings();
	createWindow();
})

//#endregion *------------------------------------------*

//#region *------------------Main-----------------------*

ipcMain.on('quit', () => {
	app.exit();
	main = null
	player = null
})

ipcMain.on('maximize', () => {
	if (main) {
		main.isMaximized() ? main.restore() : main.maximize();
	}
})

ipcMain.on('minimize', () => {
	main?.minimize();
})

ipcMain.on('load-ready', () => {
	main?.webContents.send('ready')
})

ipcMain.handle('load-settings', () => {
	return savedSettings;
})

ipcMain.on('save-settings', () => {
	SaveSettings();   
})

ipcMain.on('log', (_e, message: React.ReactNode) => {
	main?.webContents.send('on-log', message)
})
// UI Settings

ipcMain.on('darkmode', () => {
	if (nativeTheme.shouldUseDarkColors) {
		nativeTheme.themeSource = 'light'
	} else {
		nativeTheme.themeSource = 'dark'
	}
	savedSettings.darkMode = nativeTheme.shouldUseDarkColors;
	SaveSettings();
})


ipcMain.on('select-home', (e: Electron.IpcMainEvent) => {
	dialog.showOpenDialog(main as BrowserWindow, {
		properties: ['openDirectory']
	}).then(async result => {
		if (!result.canceled) {
			savedSettings.homePath = result.filePaths[0];
			SaveSettings();
			LoadTracks().then(bgmData => {
				e.reply('new-home', bgmData, savedSettings.homePath)
			})
		}
	}).catch(err => {
		console.log(err);
	})
})

ipcMain.on('add-local-tracks', (e: Electron.IpcMainEvent, size: number) => {
	dialog.showOpenDialog(main as BrowserWindow, {
		properties: ['multiSelections'],
		filters: [
			{
				name: 'Audio Files',
				extensions: FORMATS.map(format => format.replace('.', ''))
			}
		]
	}).then(async results => {
		if (!results.canceled) {
			const tracks = results.filePaths.map((filePath, index) => ({
				id: size + index,
				url: filePath,
				title: GetTrackTitle(filePath.split('\\').pop() || filePath.split('/').pop() || ''),
				duration: undefined,
				queue: {
					pos: size + index,
					played: false
				}
			}
		));
			e.reply('new-local-tracks', tracks)  
		}
	}).catch(err => {
		console.log(err);
	})
})

ipcMain.on('download-youtube', (_e: Electron.IpcMainEvent, link: string) => {
	const file = ytdl(link);
	console.log('Downloading: ' + link);
	file.pipe(fs.createWriteStream('audio.mp3'))

	file.on('error', (err) => {
		console.log(err)
	})
	file.on('end', () => {
		console.log('done');
	})
})

/**
 * To remove file format from track title
 * @param track the track title
 * @returns the track without the format
*/
function GetTrackTitle(track: string): string {
	for (let index = 0; index < FORMATS.length; index++) {
		if (track.endsWith(FORMATS[index])) {
			return track.slice(0, -FORMATS[index].length);
		}
	}
	return track;
}

async function LoadTracks() {
	const items = await fs.promises.readdir(savedSettings.homePath);
	const filteredTracks = items.filter((track: string) => {
		const extension = path.extname(track).toLowerCase();
		return FORMATS.includes(extension);
	});

	const bgmData = new Map<number, Track>();
	let count = 0;

	filteredTracks.forEach((track: string) => {
		const trackData: Track = {
			id: count,
			url: path.join(savedSettings.homePath, track), // Use path.join for better compatibility
			title: GetTrackTitle(track),
			duration: undefined,
			queue: {
					pos: count,
					played: false
			},
			type: 'local'
		};
		bgmData.set(count, trackData);
		count++;
	});

	return bgmData;
}

ipcMain.handle('load-tracks', async () => {
	return await LoadTracks();
});

ipcMain.handle('read-thumbnail', async (_e: Electron.IpcMainInvokeEvent, urls: string[] | string) => {
    // return new Promise((resolve, reject) => {
    //     const worker = new Worker(path.join(__dirname, 'worker.js'));

    //     worker.on('message', (result) => {
    //         resolve(result);
    //         console.log(result);
    //         worker.terminate();
    //     });

    //     worker.on('error', (_) => {
    //         reject('');
    //         worker.terminate();
    //     });
    //     worker.postMessage(urls);
    // });

    async function readThumbnail(url: string) {
			try {
				const mm = await loadEsm<typeof import('music-metadata')>('music-metadata');
                // @ts-ignore
				const metadata = await mm.parseFile(url);
				const picture = metadata.common.picture?.[0];
				if (picture) {
					const base64String = `data:${picture.format};base64,${Buffer.from(picture.data).toString('base64')}`;
					return base64String;
				} else {
					return '';
				}
		} catch (error) {
			return '';
		}
	};
	
	if (typeof urls === 'string') {
		return await readThumbnail(urls);
	} else {
		return await Promise.all(urls.map(url => readThumbnail(url)));
	}
});

ipcMain.handle('load-queue', async () => {
	const bgmData = await fs.promises.readFile(QUEUE_FILE, 'utf8');
	return new Map(JSON.parse(bgmData).map((track: Track) => [track.id, track]))
});

ipcMain.on('save-queue', async (_e: Electron.IpcMainEvent, bgm: Map<number, Track>) => {
	await fs.promises.writeFile(QUEUE_FILE, JSON.stringify(Array.from(bgm.values())), 'utf8');
})

ipcMain.on('play-track', (_e, trackPath: string) => {
	player?.webContents.send('track', trackPath);
})

ipcMain.on('seek-track', (_e, time: number) => {
	player?.webContents.send('seek', time);
})  

ipcMain.on('volume-player', (_e, volume: number) => {
	savedSettings.volume = volume;
	player?.webContents.send('volume', volume);
})

//#endregion *---------------------------------------------*

//#region *-----------------Player----------------------*

ipcMain.on('track-started', (_e, duration: number) => {
	main?.webContents.send('started', duration);
})

ipcMain.on('track-ended', () => {
	main?.webContents.send('ended');
})

ipcMain.on('on-progress', (_e, currentTime: number) => {
	if (main) {
		main?.webContents.send('playback', currentTime);
	}
})

ipcMain.on('play-player', (_e, playing: boolean) => {
	player?.webContents.send('play', playing);
})

ipcMain.on('reset-player', () => {
	player?.webContents.send('reset');
})

ipcMain.on('mute-player', (_e, mute: boolean) => {
	player?.webContents.send('mute', mute);
})

ipcMain.on('loop-player', (_e, loop: boolean) => {
	player?.webContents.send('loop', loop);
})

ipcMain.on('on-error', () => {
	main?.webContents.send('error')
})

//#endregion *---------------------------------------------*
