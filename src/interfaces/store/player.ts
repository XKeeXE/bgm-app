import MinHeap from "../../toolbox/utils/MinHeap";

export type TrackType = "local" | "youtube" | "spotify";

export type Track = {
  id: number;
  url: string;
  title: string;
  duration?: string;
  queue: {
    pos: number;
    played: boolean;
  };
  type: TrackType;
};

interface IPlayer {
  bgm: Map<number, Track>;
  currentTrack: Track;
  bgmQueue: MinHeap;
  playedQueue: Track[];

  volume: number;
  setVolume: (volume: number) => void;

  loop: boolean;
  setLoop: (value?: boolean) => void;

  playing: boolean;
  setPlaying: (value?: boolean) => void;

  mute: boolean;
  setMute: (value?: boolean) => void;

  initialized: boolean;
  setInitialized: (value: boolean) => void;

  duration: number;
  setDuration: (duration: number) => void;

  resetPlayer: () => void;

  loadTracks: (bgm: Map<number, Track>) => void;
  playTrack: (track: Track) => void;
  playNextInQueue: () => void;
  playPrevious: () => void;

  removeFromQueue: (track: Track) => void;
  queueTrack: (track: Track) => void;
  stackTrack: (track: Track) => void;
  shuffleQueue: () => void;
  reorderQueue: (orderedItems: Array<{ id: number; newPos: number }>) => void;

  resetQueue: (tracks: IterableIterator<Track> | Track[]) => void;
  syncQueue: (type: "save" | "load") => void;
}

export default IPlayer;
