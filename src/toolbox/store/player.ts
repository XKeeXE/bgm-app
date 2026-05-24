import IStore from "../../interfaces/store";
import { lens } from "@dhmk/zustand-lens";
import { current } from "immer";
import { Track } from "../../interfaces/store/player";
import MinHeap from "../utils/MinHeap";

export const DEFAULT_TRACK: Track = {
  id: -1,
  url: "",
  title: "",
  duration: undefined,
  queue: { pos: -1, played: false },
  type: "local",
};

/**
 * Terminology:
 * BGM - The available tracks to play.
 * Track - A single music file.
 * Tracks - Multiple music files.
 */
export const playerSlice = lens<IStore["player"], IStore>((set, get) => {
  return {
    bgm: new Map<number, Track>(),
    currentTrack: DEFAULT_TRACK,
    bgmQueue: new MinHeap(),
    playedQueue: [],
    volume: 0.5,
    loop: false,
    playing: false,
    mute: false,
    initialized: false,
    duration: 0,

    setVolume: (volume) => {
      set((state) => {
        state.volume = volume;
      });
      window.api.changeVolume(volume);
    },

    setLoop: (value) => {
      set((state) => {
        state.loop = value ?? !state.loop;
      });
      const loop = get().loop;
      window.api.loopPlayer(loop);
      window.general.log(`Looping is now ${loop}`);
    },

    setPlaying: (value) => {
      set((state) => {
        state.playing = value ?? !state.playing;
      });
      const playing = get().playing;
      window.api.playPlayer(playing);
      window.general.log(`The player is now ${playing ? 'playing' : 'paused'}`);
    },

    setMute: (value) => {
      set((state) => {
        state.mute = value ?? !state.mute;
      });
      window.api.mutePlayer(get().mute);
    },

    setInitialized: (value) => {
      set((state) => { state.initialized = value; });
    },

    setDuration: (duration) => {
      set((state) => { state.duration = duration; });
    },

    resetPlayer: () => {
      set((state) => {
        state.playing = false;
        state.initialized = false;
        state.currentTrack = DEFAULT_TRACK;
        state.playedQueue = [];
        for (const track of state.bgm.values()) {
          track.queue.played = false;
        }
      });
      window.api.resetPlayer();
      get().resetQueue(get().bgm.values());
    },

    loadTracks: (bgmData) => {
      set((state) => {
        state.bgm = bgmData;
      });
      get().resetQueue(bgmData.values());
    },

    playTrack: (track) => {
      if (track.id === -1) {
        set((state) => { state.currentTrack = DEFAULT_TRACK; });
        return;
      }
      set((state) => {
        const draftTrack = state.bgm.get(track.id);
        if (draftTrack) {
          draftTrack.queue.played = true;
          state.playedQueue.push(draftTrack);
          state.currentTrack = draftTrack;
          state.initialized = true;
          state.playing = true;
        } else {
          // DEFAULT_TRACK (id: -1) isn't in bgm — used for resets
          state.currentTrack = { ...track };
        }
      });
      window.general.log(`Now playing: ${track.title}`);
      document.title = track.title;
    },

    playNextInQueue: () => {
      let nextTrack: Track | null = null;
      set((state) => {
        const extracted = state.bgmQueue.extractMin();
        if (extracted) nextTrack = current(extracted);
      });
      nextTrack ? get().playTrack(nextTrack) : window.general.log("End of the playlist");
    },

    playPrevious: () => {
      set((state) => {
        if (state.playedQueue.length === 0) return;
        const current = state.playedQueue.pop();
        if (current) {
          current.queue.played = false;
          state.bgm.set(current.id, current);
        }
      });
      const { playedQueue, bgm } = get();
      if (playedQueue.length === 0) {
        set((state) => { state.currentTrack = DEFAULT_TRACK; });
      } else {
        const prev = playedQueue[playedQueue.length - 1];
        set((state) => { state.playedQueue.pop(); });
        const prevTrack = bgm.get(prev.id);
        if (prevTrack) get().playTrack(prevTrack);
      }
      get().resetQueue(get().bgm.values());
    },

    removeFromQueue: (track) => {
      set((state) => {
        state.bgmQueue.remove(track);
      });
    },

    queueTrack: (track) => {
      set((state) => {
        const currentPos = track.queue.pos;
        const maxUnplayedPos = Math.max(
          -1,
          ...Array.from(state.bgm.values())
            .filter((t) => !t.queue.played && t.id !== track.id)
            .map((t) => t.queue.pos)
        );
        state.bgm.forEach((t) => {
          if (t.id === track.id) {
            t.queue.played = false;
            t.queue.pos = maxUnplayedPos + 1;
          } else if (!t.queue.played && t.queue.pos > currentPos) {
            t.queue.pos -= 1;
          }
        });
      });
      get().resetQueue(get().bgm.values());
      window.general.log(`Queued: ${track.title}`);
    },

    stackTrack: (track) => {
      set((state) => {
        const currentPos = track.queue.pos;
        state.bgm.forEach((t) => {
          if (t.id === track.id) {
            t.queue.played = false;
            t.queue.pos = 0;
          } else if (!t.queue.played && t.queue.pos < currentPos) {
            t.queue.pos += 1;
          }
        });
      });
      get().resetQueue(get().bgm.values());
      window.general.log(`Stacked: ${track.title}`);
    },

    queueTracks: (tracks) => {
      set((state) => {
        const selectedIds = new Set(tracks.map((t) => t.id));
        const rest = Array.from(state.bgm.values())
          .filter((t) => !selectedIds.has(t.id) && !t.queue.played)
          .sort((a, b) => a.queue.pos - b.queue.pos);
        rest.forEach((t, i) => { t.queue.pos = i; });
        tracks.forEach((track, i) => {
          const draft = state.bgm.get(track.id);
          if (draft) {
            draft.queue.played = false;
            draft.queue.pos = rest.length + i;
          }
        });
      });
      get().resetQueue(get().bgm.values());
      window.general.log(`Queued ${tracks.length} tracks`);
    },

    stackTracks: (tracks) => {
      set((state) => {
        const selectedIds = new Set(tracks.map((t) => t.id));
        const rest = Array.from(state.bgm.values())
          .filter((t) => !selectedIds.has(t.id) && !t.queue.played)
          .sort((a, b) => a.queue.pos - b.queue.pos);
        tracks.forEach((track, i) => {
          const draft = state.bgm.get(track.id);
          if (draft) {
            draft.queue.played = false;
            draft.queue.pos = i;
          }
        });
        rest.forEach((t, i) => { t.queue.pos = tracks.length + i; });
      });
      get().resetQueue(get().bgm.values());
      window.general.log(`Stacked ${tracks.length} tracks`);
    },

    shuffleQueue: () => {
      set((state) => {
        const tracksArray = Array.from(state.bgm.values());
        for (let i = tracksArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [tracksArray[i], tracksArray[j]] = [tracksArray[j], tracksArray[i]];
        }
        tracksArray.forEach((t, index) => {
          const track = state.bgm.get(t.id);
          if (track) track.queue.pos = index;
        });
      });
      get().resetQueue(get().bgm.values());
      window.general.log("Queue shuffled");
    },

    reorderQueue: (orderedItems) => {
      set((state) => {
        orderedItems.forEach(({ id, newPos }) => {
          const track = state.bgm.get(id);
          if (track) track.queue.pos = newPos;
        });
      });
      get().resetQueue(get().bgm.values());
    },

    resetQueue: (tracks) =>
      set((state) => {
        const newHeap = new MinHeap();
        for (const track of tracks) {
          if (!track.queue.played) {
            newHeap.insert(track);
          }
        }
        state.bgmQueue = newHeap;
      }),

    syncQueue: (type) => {
      const data = Array.from(get().bgm.values());
      switch (type) {
        case "save":
          window.api.saveQueue(new Map(data.map((track) => [track.id, track])));
          window.general.log("Queue saved");
          break;
        case "load":
          window.api.loadQueue().then((bgmData) => {
            get().loadTracks(bgmData);
            get().playNextInQueue();
          });
          break;
      }
    },
  };
});
