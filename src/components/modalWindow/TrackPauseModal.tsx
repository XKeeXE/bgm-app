import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { ipcRenderer } from "electron";

const TrackPauseModal = () => {
    const [playing, setPlaying] = useState<boolean>(true);
    useEffect(() => {
        ipcRenderer.on('updatePlaying', (_e, newState) => {
            setPlaying(newState);
        })
        return () => {
            ipcRenderer.removeAllListeners('updatePlaying');
        };
    }, [])
    return (
        <>
        <Button radius="full" size="md" variant="ghost" aria-label="pause" isIconOnly  onClick={() => {
            // setPlaying(!playing); // if paused play, if playing pause
            ipcRenderer.send('togglePlaying'); // Playing: true | false
            console.log("(Modal)" + playing);
        }}>{playing ? <PauseIcon /> : <PlayIcon/>}
        </Button>
        </>
    )
}

export default TrackPauseModal;