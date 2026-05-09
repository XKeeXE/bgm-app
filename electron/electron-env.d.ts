/// <reference types="vite-plugin-electron/electron-env" />

type Track = import('../src/interfaces/store/player').Track;
type Setting = import('../src/toolbox/utils/types').Setting;

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    DIST: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

interface API {
    // General
    quit: () => void,
    maximize: () => void,
    minimize: () => void,

    loadReady: () => void,
    onLoaded: (callback: (settings: Setting) => void) => void,
    saveSettings: () => void,

    // Main
    loadTracks: () => Promise<Map<number, Track>>,
    downloadYoutube: (link: string) => void,

    playTrack: (track: string) => void,
    seekTrack: (time: number) => void,

    saveQueue: (bgm: Map<number, Track>) => void,
    loadQueue: () => Promise<Map<number, Track>>,
    readThumbnail: (url: string[] | string) => Promise<string[] | string>,

    changeVolume: (volume: number) => void,

    // Player
    onTrackStarted: (callback: (duration: number) => void) => void,
    onProgress: (callback: (currentTime: number) => void) => void,
    onTrackEnded: (callback: () => void) => void,
    onError: (callback: () => void) => void,

    playPlayer: (playing: boolean) => void,
    resetPlayer: () => void,
    mutePlayer: (boolean: boolean) => void,
    loopPlayer: (boolean: boolean) => void,

    // Settings
    darkmode: () => void,
    selectHome: () => void,
    newHome: (callback: (bgm: Map<number, Track>, path: string) => void) => void,

    addLocalTracks: (size: number) => void,
    newLocalTracks: (callback: (tracks: Track[]) => void) => void,
}

interface General {
    log: (message: string) => void,
    onLog: (callback: (message: string) => void) => void,
    removeLog: () => void,
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
  api: API;
  general: General;
}
