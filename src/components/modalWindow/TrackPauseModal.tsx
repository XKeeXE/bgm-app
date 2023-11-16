import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { ipcRenderer } from "electron";

const TrackPauseModal = (props: any) => {
    const [playing, setPlaying] = useState(true);
    useEffect(() => {
        ipcRenderer.on('track-playing-main', (e, data) => {
            setPlaying(data);
        })
    }, [])
    return (
        <>
        <Button radius="full" size="lg" aria-label="pause" isIconOnly onClick={() => {
                setPlaying(!playing); // if paused play, if playing pause
                ipcRenderer.send('track-playing-modal', playing); // Playing: true | false
            }}>{playing ? <PlayIcon/> : <PauseIcon/> }
            </Button>
        </>
    )
}

export default TrackPauseModal;