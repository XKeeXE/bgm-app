import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ipcRenderer } from "electron";

import LoopIcon from '@mui/icons-material/Loop';

const TrackLoopModal = () => {
    const [loopTrack, setLoopTrack] = useState<boolean>(false);
    useEffect(() => {
        ipcRenderer.on('updateLoop', (_e, newState) => {
            setLoopTrack(newState);
        })
        return () => {
            ipcRenderer.removeAllListeners('updateLoop');
        };
    }, [])
    return (
        <>
        <Button variant="light" size="sm" isIconOnly aria-label="load queue" onClick={() => {
            // setLoopTrack(!loopTrack); // if paused play, if playing pause
            ipcRenderer.send('toggleLoop');
            console.log("(Modal) Looping is: " + loopTrack); // Looping: true | false
        }}><LoopIcon color={loopTrack ? "inherit" : "disabled"}/>
        </Button>
        </>
    )
}

export default TrackLoopModal;