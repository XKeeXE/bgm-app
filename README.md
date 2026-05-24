# BGM App

A desktop music player built with **Electron**, **Vite**, and **TypeScript**.
Supports local audio files and YouTube sources, with a clean UI designed for effortless playback control.

## Stack

- **Electron** — two BrowserWindows: App (renderer, preload, contextIsolation) and Player (nodeIntegration, handles `<audio>` directly)
- **Vite** + `vite-plugin-electron/simple` — fast dev server with HMR for both renderer and electron processes
- **React 19** + React Compiler (`babel-plugin-react-compiler`) — no manual `useMemo`/`useCallback`
- **TypeScript** — strict throughout
- **Zustand 5** + `@dhmk/zustand-lens` + **Immer** — single `useStore` with `app` and `player` slices
- **Tailwind CSS** — `darkMode: "media"` for automatic system-theme response
- **TanStack Virtual** — virtualized track list for large libraries (3000+ tracks)

## Features

- Play, pause, skip, loop, shuffle, and go back through a MinHeap-based priority queue
- Queue and stack tracks for ordered or LIFO playback
- `initialized` state gates playback controls — Back resets the player when no history exists
- Full player reset: clears current track, played history, and reloads the queue from scratch
- Volume control via slider or keyboard (`←` / `→` arrow keys), Space to play/pause
- Keyboard shortcuts via `react-hotkeys-hook`, mounted at the App root
- IPC bridge for all player commands: play, pause, seek, volume, mute, loop, reset
- Listener stacking on fast refresh prevented via `removeAllListeners` before each `ipcRenderer.on`
- Thumbnail display for currently playing track
- Track progress bar with seek support
- Settings panel with dark mode toggle and home directory selection
- YouTube download support
