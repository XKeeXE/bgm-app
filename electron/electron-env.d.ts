/// <reference types="vite-plugin-electron/electron-env" />

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
    onLoaded: (callback: (settings: setting) => void) => void,
    offLoaded: () => void,
    saveSettings: () => void,

    log: (message: string) => void,
    onLog: (callback: (message: string) => void) => void,
    removeLog: () => void,

    // Main
    loadTracks: () => Promise<Map<number, track>>,

    playTrack: (track: string) => void,
    seekTrack: (time: number) => void,

    saveQueue: (bgm: Map<number, track>) => void,
    loadQueue: () => Promise<Map<number, track>>,
    readThumbnail: (url: string[] | string) => Promise<string[] | string>,

    changeVolume: (volume: number) => void,

    // Player
    onTrackStarted: (callback: (duration: number) => void) => void,
    onProgress: (callback: (currentTime: number) => void) => void,
    onTrackEnded: (callback: () => void) => void,
    onError: (callback: () => void) => void,

    offTrackStarted: () => void,
    offProgress: () => void,
    offTrackEnded: () => void,
    offError: () => void,
    
    pausePlayer: (pause: boolean) => void,
    mutePlayer: (boolean: boolean) => void,
    loopPlayer: (boolean: boolean) => void,

    // Settings
    darkmode: () => Promise<boolean>,
    selectHome: () => void,
    newHome: (callback: (bgm: Map<number, track>, path: string) => void) => void,
    removehome: () => void,
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
  api: API;
  general: API;
}
