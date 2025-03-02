import { contextBridge, ipcRenderer } from 'electron'
import { track } from '../src/components/types/types';

contextBridge.exposeInMainWorld(
    "api", {
        // General
        quit: () => {
            ipcRenderer.send('quit');
        },

        // Main
        loadTracks: () => {
            return ipcRenderer.invoke('load-tracks');
        },

        playTrack: (trackPath: string) => {
            ipcRenderer.send('play-track', trackPath);
        },
        seekTrack: (time: number) => {
            ipcRenderer.send('seek-track', time);
        },

        saveQueue: (bgm: Map<number, track>) => {
            ipcRenderer.send('save-queue', bgm)
        },
        loadQueue: () => {
            return ipcRenderer.invoke('load-queue'); 
        },
        readThumbnails: () => {
            return ipcRenderer.invoke('read-thumbnail');
        },

        changeVolume: (volume: number) => {
            ipcRenderer.send('volume-player', volume);
        },


        // Player
        onTrackStarted: (callback: any) => {
            ipcRenderer.on('started', (_e, duration: number) => {
                callback(duration);
            });
        },
        onProgress: (callback: any) => {
            ipcRenderer.on('playback', (_e, currentTime: number) => {
                callback(currentTime);
            });
        },
        onTrackEnded: (callback: any) => {
            ipcRenderer.on('ended', () => {
                callback();
            });
        },


        pausePlayer: (pause: boolean) => {
            ipcRenderer.send('pause-player', pause);
        },
        mutePlayer: (mute: boolean) => {
            ipcRenderer.send('mute-player', mute);
        },
        loopPlayer: (loop: boolean) => {
            ipcRenderer.send('loop-player', loop);

        },
        

        // Settings
        darkmode: () => {
            return ipcRenderer.invoke('darkmode');
        },
        selectHome: () => {
            ipcRenderer.send('select-home');
        }, 
        newHome: (callback: any) => {
            ipcRenderer.on('new-home', (_e, bgm: Map<number, track>, path: string) => {
                callback(bgm, path);
            });
        }
        
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