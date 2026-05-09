import { contextBridge, ipcRenderer } from 'electron'
import { Track } from '../src/interfaces/store/player';
import { Setting } from '../src/toolbox/utils/types';

contextBridge.exposeInMainWorld(
    "api", {
        // General
        quit: () => {
            ipcRenderer.send('quit');
        },
        maximize: () => {
            ipcRenderer.send('maximize');
        },
        minimize: () => {
            ipcRenderer.send('minimize');
        },

        loadReady: () => {
            ipcRenderer.send('load-ready');
        },
        onLoaded: (callback: (settings: Setting) => void) => {
            ipcRenderer.removeAllListeners('loaded');
            ipcRenderer.on('loaded', (_e, settings: Setting) => callback(settings));
        },
        saveSettings: () => {
            ipcRenderer.send('save-settings');
        },

        // Main
        loadTracks: () => {
            return ipcRenderer.invoke('load-tracks');
        },
        downloadYoutube: (link: string) => {
            ipcRenderer.send('download-youtube', link);
        },

        playTrack: (trackPath: string) => {
            ipcRenderer.send('play-track', trackPath);
        },
        seekTrack: (time: number) => {
            ipcRenderer.send('seek-track', time);
        },

        saveQueue: (bgm: Map<number, Track>) => {
            ipcRenderer.send('save-queue', bgm);
        },
        loadQueue: () => {
            return ipcRenderer.invoke('load-queue');
        },
        readThumbnail: (url: string[] | string) => {
            return ipcRenderer.invoke('read-thumbnail', url);
        },

        changeVolume: (volume: number) => {
            ipcRenderer.send('volume-player', volume);
        },

        // Player events (from player window back to main renderer)
        onTrackStarted: (callback: (duration: number) => void) => {
            ipcRenderer.removeAllListeners('started');
            ipcRenderer.on('started', (_e, duration: number) => callback(duration));
        },
        onProgress: (callback: (currentTime: number) => void) => {
            ipcRenderer.removeAllListeners('playback');
            ipcRenderer.on('playback', (_e, currentTime: number) => callback(currentTime));
        },
        onTrackEnded: (callback: () => void) => {
            ipcRenderer.removeAllListeners('ended');
            ipcRenderer.on('ended', () => callback());
        },
        onError: (callback: () => void) => {
            ipcRenderer.removeAllListeners('error');
            ipcRenderer.on('error', () => callback());
        },

        playPlayer: (playing: boolean) => {
            ipcRenderer.send('play-player', playing);
        },
        resetPlayer: () => {
            ipcRenderer.send('reset-player');
        },
        mutePlayer: (mute: boolean) => {
            ipcRenderer.send('mute-player', mute);
        },
        loopPlayer: (loop: boolean) => {
            ipcRenderer.send('loop-player', loop);
        },

        // Settings
        darkmode: () => {
            ipcRenderer.send('darkmode');
        },
        selectHome: () => {
            ipcRenderer.send('select-home');
        },
        newHome: (callback: (bgm: Map<number, Track>, path: string) => void) => {
            ipcRenderer.removeAllListeners('new-home');
            ipcRenderer.on('new-home', (_e, bgm: Map<number, Track>, path: string) => callback(bgm, path));
        },

        addLocalTracks: (size: number) => {
            ipcRenderer.send('add-local-tracks', size);
        },
        newLocalTracks: (callback: (tracks: Track[]) => void) => {
            ipcRenderer.removeAllListeners('new-local-tracks');
            ipcRenderer.on('new-local-tracks', (_e, tracks: Track[]) => callback(tracks));
        },
    }
);

contextBridge.exposeInMainWorld(
    "general", {
        log: (message: string) => {
            ipcRenderer.send('log', message);
        },
        onLog: (callback: (message: string) => void) => {
            ipcRenderer.removeAllListeners('on-log');
            ipcRenderer.on('on-log', (_e, message: string) => callback(message));
        },
    }
);

// --------- Preload scripts loading ---------
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      parent.removeChild(child)
    }
  },
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    },
  }
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = ev => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)