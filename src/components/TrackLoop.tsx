import { Button, Tooltip } from "@nextui-org/react";
import { useEffect } from "react";
import { ipcRenderer } from "electron";

import LoopIcon from '@mui/icons-material/Loop';

const TrackLoop = (props: any) => {
    const { loopTrack, setLoopTrack} = props;

    useEffect(() => {
        ipcRenderer.on('updateLoop', (_e, newState) => {
            setLoopTrack(newState);
        })
        
        return () => {
            ipcRenderer.removeAllListeners('updateLoop');
        };
    }, [])

    return (
        <Tooltip content={(loopTrack ? "Stop" : "Start") + " loop"}>
            <Button variant="light" size="md" isIconOnly aria-label="load queue" onClick={() => {
                // setLoopTrack(!loopTrack); // if paused play, if playing pause
                ipcRenderer.send('toggleLoop');
                console.log("Looping is: " + loopTrack); // Looping: true | false
            }}><LoopIcon color={loopTrack ? "inherit" : "disabled"}/>
            </Button>
        </Tooltip>
    )
}

export default TrackLoop;