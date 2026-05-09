# BGM App — REBIRTH

A full architectural rework of the BGM App. This document explains the decisions made, the problems that were solved, and the foundation that is now in place for future development.

---

## Table of Contents

1. [Why the Rework?](#why-the-rework)
2. [Electron Window Structure](#electron-window-structure)
3. [IPC Architecture](#ipc-architecture)
4. [The Zustand Store](#the-zustand-store)
   - [App Slice](#app-slice)
   - [Player Slice](#player-slice)
5. [The MinHeap Queue](#the-minheap-queue)
6. [Immer + Zustand Gotchas](#immer--zustand-gotchas)
7. [File Structure](#file-structure)
8. [React Compiler](#react-compiler)
9. [Terminology](#terminology)
10. [MVP Phases](#mvp-phases)
11. [Open Questions / Future Decisions](#open-questions--future-decisions)

---

## Why the Rework?

The original architecture used **React Context** (`BGMContext`) as the shared state container. This meant:

- All state (BGM map, queue, playback, settings) was lifted into `App.tsx` via `useState` / `useRef`
- Every component that consumed the context would re-render whenever *any* part of that context changed, even if it only needed a small piece
- Actions were passed down as functions through the context, making the dependency chain implicit and hard to trace
- The BGM queue (`MinHeap`) was stored in a `useRef`, meaning mutations were invisible to React — requiring a separate `forceUpdate` hack to trigger re-renders
- The `playedQueue` was also a `useRef`, so components reading it never reflected live state

The rework replaces `BGMContext` with a **Zustand store using Immer and `@dhmk/zustand-lens`**, solving all of the above:

- Components subscribe to only the exact slices they need — granular reactivity, no unnecessary re-renders
- The `MinHeap` is stored directly in Zustand state (not a ref), so mutations are acknowledged by React correctly
- All actions are co-located in the store slice that owns the data
- `forceUpdate` and its associated ref are completely gone

---

## Electron Window Structure

The app runs two Electron `BrowserWindow` instances:

```
Electron Main Process (main.ts)
│
├── App Window  (index.html → src/app/index.tsx)
│     contextIsolation: true
│     nodeIntegration: false
│     preload: preload.js
│     → Hosts all React UI: settings, track list, queue, navbar, utilities
│     → Owns the Zustand store entirely
│     → Communicates with Main Process via contextBridge (window.api, window.general)
│
└── Player Window  (player.html → src/app/player.tsx)
      contextIsolation: false
      nodeIntegration: true
      show: false  (invisible)
      → Hosts only an <audio> element + Web Audio API nodes
      → Has NO Zustand store — it is a dumb audio renderer
      → Communicates directly with Main Process via raw ipcRenderer
```

**The Player window is intentionally dumb.** It does not know what track is currently playing by name — it only receives a file path and plays it. All playback state (current track, queue position, played history) lives exclusively in the App window's Zustand store.

### Why two windows?

The Web Audio API requires `createMediaElementSource()` to be called on an `<audio>` element exactly once. If the audio element lived in the App window (which has a complex React render tree), React StrictMode's double-invoke behavior in development would call it twice and throw an `InvalidStateError`. By isolating audio playback in a separate headless window with no StrictMode, this constraint is trivially satisfied.

---

## IPC Architecture

Communication flows through the Electron Main Process as a relay:

```
App Window
  │
  │  window.api.playTrack(url)          [contextBridge]
  ▼
Main Process
  │
  │  player?.webContents.send('track', url)
  ▼
Player Window
  │
  │  ipcRenderer.send('track-started', duration)
  ▼
Main Process
  │
  │  main?.webContents.send('started', duration)
  ▼
App Window
  │  window.api.onTrackStarted(callback)
```

### `window.api` — App-facing API (contextBridge)

Defined in `electron/preload.ts`, exposed to the App renderer. Key methods:

| Method | Direction | Description |
|---|---|---|
| `loadTracks()` | App → Main | Reads audio files from `homePath`, returns `Map<number, Track>` |
| `playTrack(url)` | App → Player | Relays track path to Player window |
| `saveQueue(bgm)` | App → Main | Serializes current BGM map to `BGMQUEUE.txt` |
| `loadQueue()` | App → Main | Deserializes `BGMQUEUE.txt`, returns `Map<number, Track>` |
| `onLoaded(cb)` | Main → App | Fires on window load with saved `Setting` object |
| `onTrackStarted(cb)` | Player → App | Fires when audio begins playing, sends duration |
| `onTrackEnded(cb)` | Player → App | Fires when audio ends naturally |
| `onError(cb)` | Player → App | Fires on audio playback error |
| `changeVolume(n)` | App → Player | Updates `gainNode.gain.value` in Player window |
| `pausePlayer(bool)` | App → Player | Pauses or resumes audio |

### `window.general` — Dev/Logging API (contextBridge)

| Method | Description |
|---|---|
| `log(message)` | Sends a log message to the console panel in `UIUtilities` |
| `onLog(callback)` | Subscribes to log messages |
| `removeLog()` | Removes the log listener |

---

## The Zustand Store

**Stack:** `zustand` v5 + `immer` + `@dhmk/zustand-lens` + `enableMapSet()`

```
src/toolbox/store/index.ts     ← creates the single useStore hook
src/toolbox/store/app.ts       ← appSlice (lens)
src/toolbox/store/player.ts    ← playerSlice (lens)

src/interfaces/store/index.ts  ← IStore interface
src/interfaces/store/app.ts    ← IApp interface
src/interfaces/store/player.ts ← IPlayer interface + Track type
```

`@dhmk/zustand-lens` allows splitting the store into independent slices (`app`, `player`) while keeping a single unified `useStore` hook. Each slice only sees and mutates its own state. `immer` middleware is applied to the whole store, allowing direct mutation syntax inside `set()`.

`enableMapSet()` is called once at module init because Immer does not support `Map` or `Set` by default.

### App Slice

Located at `src/toolbox/store/app.ts`, interface at `src/interfaces/store/app.ts`.

| Field | Type | Description |
|---|---|---|
| `darkMode` | `boolean` | Whether the UI uses dark mode. Initialized from saved `Setting` on `onLoaded`. |
| `maxSaveTimer` | `number` | How many track plays before auto-saving the queue. Default: `5`. |
| `language` | `Language` | UI language. Type: `'en' \| 'es' \| 'ja'`. **Not yet wired to UI — Phase 3.** |

Actions: `setDarkMode`, `setMaxSaveTimer`, `setLanguage`

### Player Slice

Located at `src/toolbox/store/player.ts`, interface at `src/interfaces/store/player.ts`.

| Field | Type | Description |
|---|---|---|
| `bgm` | `Map<number, Track>` | All available tracks, keyed by `Track.id`. |
| `currentTrack` | `Track` | The track currently playing. Defaults to `DEFAULT_TRACK` (id: -1). |
| `bgmQueue` | `MinHeap` | The ordered play queue. Tracks are extracted in ascending `queue.pos` order. |
| `playedQueue` | `Track[]` | History of played tracks in the current session. Used by `playPrevious()`. |
| `volume` | `number` | Current volume (0–2, where 1 = 100%, 2 = 200% via gain node). |
| `looped` | `boolean` | Whether the current track should loop. |

Key actions:

| Action | Description |
|---|---|
| `loadTracks(bgm)` | Replaces the `bgm` Map and resets the queue. |
| `playTrack(track)` | Sets `currentTrack`, marks track as played, appends to `playedQueue`. **Must fetch the Immer draft via `state.bgm.get(track.id)` — do NOT mutate the track argument directly.** |
| `playNextInQueue()` | Extracts the min from `bgmQueue` and calls `playTrack`. |
| `playPrevious()` | Pops `playedQueue`, rewinds to the previous track, resets queue. |
| `queueTrack(track)` | Moves track to the end of the queue (highest `queue.pos`). |
| `stackTrack(track)` | Moves track to the front of the queue (`queue.pos = 0`). |
| `shuffleQueue()` | Randomly reorders all `queue.pos` values in the `bgm` Map. |
| `reorderQueue(items)` | Applies explicit `{ id, newPos }` assignments (used by drag-and-drop in `BGMQueue`). |
| `resetQueue(tracks)` | Rebuilds `bgmQueue` MinHeap from scratch, skipping already-played tracks. |
| `syncQueue('save')` | Serializes `bgm` via `window.api.saveQueue()`. |
| `syncQueue('load')` | Loads queue from file, calls `loadTracks`, then `playNextInQueue`. |

---

## The MinHeap Queue

Located at `src/toolbox/utils/MinHeap.ts`.

The play queue is a **min-heap ordered by `Track.queue.pos`**. This means:
- The track with the lowest `queue.pos` is always at the root and will play next
- Insertion is O(log n), extraction is O(log n)
- Manual reordering (shuffle, stack, queue) works by reassigning `queue.pos` values in the `bgm` Map and then calling `resetQueue()` to rebuild the heap from scratch

### Critical Immer Interaction

Immer freezes all objects stored in Zustand state. The `MinHeap` class uses internal array mutations (`push`, `pop`, index assignment). Immer **cannot track** these internal mutations.

The pattern used throughout the store:

```ts
// 1. Get reference to the heap OUTSIDE set() — this gives the live (frozen) object
const heap = get().bgmQueue;

// 2. Mutate it directly — JavaScript allows mutating frozen objects' contents
//    (the heap's internal `heap` array is not frozen, just the MinHeap wrapper)
heap.remove(track);

// 3. Force Zustand to acknowledge the change by reassigning inside set()
set((state) => {
  state.bgmQueue = heap;
});
```

`resetQueue` takes a different approach — it creates a **brand new MinHeap** each time, which avoids the mutation tracking problem entirely.

---

## Immer + Zustand Gotchas

### 1. Never mutate the track argument in `playTrack`

Tracks retrieved from the store (`bgm.get(id)`, `minHeap.extractMin()`) are **frozen by Immer**. Doing `track.queue.played = true` on a frozen object throws a silent `TypeError` in development and fails silently in production.

**Wrong:**
```ts
playTrack: (track) => {
  set((state) => {
    track.queue.played = true; // ❌ track is frozen
  });
}
```

**Correct:**
```ts
playTrack: (track) => {
  set((state) => {
    const draft = state.bgm.get(track.id); // ✅ draft is mutable
    if (draft) {
      draft.queue.played = true;
      state.currentTrack = draft;
    }
  });
}
```

### 2. Side effects must live outside `set()`

Immer producers must be pure. Calls like `window.general.log()`, `document.title =`, and `window.api.*` must happen after the `set()` call returns.

### 3. `Array.from(map.values())` in a `useStore` selector causes infinite loops

`Array.from(...)` creates a new reference on every render. Zustand's `useSyncExternalStore` uses `Object.is()` comparison — a new reference every time means infinite re-renders.

**Wrong:**
```ts
const data = useStore(state => Array.from(state.player.bgm.values())); // ❌
```

**Correct:**
```ts
const bgm = useStore(state => state.player.bgm);
const data = useMemo(() => Array.from(bgm.values()), [bgm]); // ✅
```

---

## File Structure

```
electron/
  main.ts              ← Main process: IPC handlers, BrowserWindow setup, file I/O
  preload.ts           ← contextBridge: exposes window.api and window.general
  electron-env.d.ts    ← TypeScript declarations for window.api, window.general

src/
  app/
    index.tsx          ← App entry point + App component (merged from main.tsx + App.tsx)
    player.tsx         ← Player entry point + Player component (merged from player.tsx + PlayerApp.tsx)
    App.css            ← App-specific styles (dark/light mode, sliders, scrollbar, tooltips)
    index.css          ← Tailwind base/components/utilities

  assets/
    languages.json     ← Localization strings for en, es, ja

  components/
    BGMInputSearch.tsx ← Search bar for filtering the track list
    BGMQueue.tsx       ← Queue panel (next 10 tracks) with drag-and-drop reorder
    BGMTableList.tsx   ← Virtualized track table (tanstack/react-table + tanstack/virtual)
    SvgAssets.tsx      ← Custom SVG flag components (currently unused — Phase 3)
    TrackProgress.tsx  ← Playback progress bar + seek
    UINavbar.tsx       ← Play/pause, skip, prev, shuffle, loop, volume
    UISettings.tsx     ← Settings panel (darkmode, home folder, add local tracks)
    UIUtilities.tsx    ← Window controls + console log panel
    general/
      IconButton.tsx   ← Reusable icon button primitive

  interfaces/
    store/
      index.ts         ← IStore (combines IApp + IPlayer)
      app.ts           ← IApp interface
      player.ts        ← IPlayer interface + Track / TrackType types

  toolbox/
    store/
      index.ts         ← useStore hook (zustand + immer + withLenses)
      app.ts           ← appSlice implementation
      player.ts        ← playerSlice implementation + DEFAULT_TRACK
    utils/
      Icons.ts         ← Re-exports from @mui/icons-material
      MinHeap.ts       ← Min-heap data structure ordered by Track.queue.pos
      types.ts         ← UI, Setting, svg types

index.html             ← App window HTML entry
player.html            ← Player window HTML entry
```

---

## React Compiler

The React Compiler (`babel-plugin-react-compiler`) is the next planned addition. It performs **automatic memoization** at compile time — the equivalent of wrapping every component in `React.memo` and every value/callback in `useMemo`/`useCallback`, but without writing any of that manually.

### Why it matters here

The BGM App has several components (`BGMTableList`, `BGMQueue`, `UINavbar`) that render large lists or receive frequently-changing props. Currently:
- `BGMTableList` re-renders on every `bgm` Map change because the virtualized row callbacks are recreated each render
- `UINavbar` re-renders on every `currentTrack` change even though most of its UI is stable

The compiler would eliminate these re-renders automatically by analyzing the component's data dependencies at build time.

### Requirements

- React 19+ (or React 18 with the `react-compiler-runtime` shim)
- `babel-plugin-react-compiler` installed
- Configured in `vite.config.ts` under `@vitejs/plugin-react`'s `babel.plugins`

### Constraints for this codebase

The React Compiler requires that code follows the **Rules of React**:
- No mutations of props or state values outside of event handlers / reducers
- No side effects during render

The Immer + Zustand pattern used here is compliant — all mutations happen inside `set()` callbacks, not during render.

The one area to audit before enabling the compiler: ensure no component directly mutates a value from `useStore` outside of a store action.

---

## Terminology

| Term | Meaning |
|---|---|
| **BGM** | Background Music — the full set of available tracks loaded from the home folder |
| **Track** | A single audio file with metadata: `id`, `url`, `title`, `duration`, `queue`, `type` |
| **Tracks** | The plural — multiple audio files |
| **Queue** | The ordered sequence of tracks yet to be played, managed by the `MinHeap` |
| **bgmQueue** | The `MinHeap` instance that drives playback order |
| **playedQueue** | The session history array — tracks that have already been played |
| **queue.pos** | A number on each `Track` that determines its position in the `MinHeap` (lower = plays sooner) |
| **queue.played** | A boolean on each `Track` indicating it has already been played this session |
| **DEFAULT_TRACK** | A sentinel `Track` with `id: -1` used to represent "nothing playing" |
| **App Window** | The visible Electron window with all React UI |
| **Player Window** | The invisible Electron window that wraps the Web Audio API `<audio>` element |

---

## MVP Phases

### Phase 1 — Structural Rework ✅
- Removed `BGMContext` entirely
- Migrated all 6 components to Zustand store
- Rewrote `preload.ts` with all required IPC methods
- Fixed `MinHeap` + Immer mutation conflict
- Removed ESLint, `off*` IPC cleanup methods, `queueTracker` ref
- Consolidated entry points (`App.tsx + main.tsx → index.tsx`, `PlayerApp.tsx + player.tsx → player.tsx`)
- Fixed `Array.from` selector infinite loop in `BGMTableList`
- Fixed frozen-object mutation in `playTrack`

### Phase 2 — QOL + External Sources (Planned)
- Support external audio files beyond the home folder (drag-drop, URL import)
- YouTube/streaming source support (`downloadYoutube` IPC already exists)
- Support multiple playlists (grouping tracks — see open questions below)
- Fix known bugs: `bgmRef` frozen Map mutation in `UISettings`, `playPrevious` double-pop, console log auto-scroll
- Install and configure `vite-plugin-svgr` for flag SVG components
- Install and configure React Compiler

### Phase 3 — Multilocalization (Planned)
- Wire `app.language` store field to UI
- Language switcher in `UISettings` with flag icon (using `vite-plugin-svgr`)
- All UI strings sourced from `src/assets/languages.json`
- Keys already defined for `en`, `es`, `ja`

---

## Open Questions / Future Decisions

### Where do Playlists live?

Currently only one playlist exists implicitly: the `bgm` Map (all loaded tracks). The question is whether playlists belong in the **App slice** or the **Player slice**.

**Arguments for App slice:**
- A playlist is user-saved data (JSON of tracks), similar to settings — it's persistent configuration
- The App is the context of the whole application, not just playback

**Arguments for Player slice:**
- A playlist directly drives what's in the queue — it's playback context
- Switching playlists would need to call `loadTracks()`, which lives in the Player slice

**Current leaning:** Playlists as a concept (the saved JSON, the list of playlists, active playlist selection) belong in the **App slice**. The *content* of the active playlist feeds into the **Player slice** via `loadTracks()`. This keeps a clean separation: App knows *what exists*, Player knows *what's playing*.

**Nested playlists:** Supported by the data model as long as a `Playlist` type allows a `children: Playlist[]` field. The rendering and UX of nested playlists is a Phase 2+ concern.
