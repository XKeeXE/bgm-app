import ReactDOM from 'react-dom/client'
import { useEffect, useRef } from "react";
import { ipcRenderer } from "electron";

const audioContext = new window.AudioContext();
const gainNode = audioContext.createGain();

function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const loop = useRef<boolean>(false);
  const playing = useRef<boolean>(false);
  const currentTrack = useRef<string>('');
  const resetting = useRef<boolean>(false);

  useEffect(() => {
    if (audioRef.current) {
      // DOES NOT WORK IF STRICT MODE IS ACTIVATED
      const track = audioContext.createMediaElementSource(audioRef.current);
      track.connect(gainNode);
      gainNode.connect(audioContext.destination);
    }

    ipcRenderer.on("loaded", (_e, savedVolume: number) => {
      console.log(savedVolume);
      gainNode.gain.value = Math.max(Math.min(savedVolume, 2), 0);
    });

    // Main

    ipcRenderer.on("track", (_e, trackPath: string) => {
      if (audioRef.current) {
        currentTrack.current = trackPath.replace("#", "%23");
        console.log(trackPath);
        playing.current = false;
        audioRef.current.src = currentTrack.current;
        audioRef.current.addEventListener(
          "canplaythrough",
          () => {
            audioRef.current!.play();
          },
          { once: true },
        );
      }
    });

    // UI Navbar

    ipcRenderer.on("play", (_e, playing) => {
      playing ? audioRef.current?.play() : audioRef.current?.pause();
      console.log(`Playing is ${playing}`);
    });

    ipcRenderer.on("reset", () => {
      if (audioRef.current) {
        resetting.current = true;
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.load();
      }
    });

    ipcRenderer.on("mute", (_e, mute) => {
      audioRef.current!.muted = mute;
      console.log(`The mute is ${mute}`);
    });

    ipcRenderer.on("volume", (_e, newVolume) => {
      gainNode.gain.value = newVolume;
      console.log(`The new volume is ${newVolume}`);
    });

    // Track Progress

    ipcRenderer.on("seek", (_e, time) => {
      audioRef.current!.currentTime = time;
    });
  }, []);

  return (
    <audio
      ref={audioRef}
      onPlay={() => {
        if (!playing.current) {
          playing.current = true;
        }
      }}
      onCanPlay={() => {
        ipcRenderer.send("track-started", audioRef.current?.duration);
      }}
      onTimeUpdate={() => {
        ipcRenderer.send("on-progress", audioRef.current?.currentTime);
      }}
      onEnded={() => {
        if (!loop.current && !resetting.current) {
          ipcRenderer.send("track-ended");
        }
      }}
      onError={() => {
        if (resetting.current) {
          resetting.current = false;
          return;
        }
        ipcRenderer.send("on-error");
      }}
    />
  );
}

ReactDOM.createRoot(document.getElementById('player-root')!).render(
  <Player />
)