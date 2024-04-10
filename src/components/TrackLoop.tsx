import { Button, Tooltip } from "@nextui-org/react";
import LoopIcon from '@mui/icons-material/Loop';

const TrackLoop = (props: any) => {
    const { setLoopTrack, loopTrack} = props;
    return (
        <Tooltip content={(loopTrack ? "Stop" : "Start") + " loop"}>
            <Button variant="light" size="md" isIconOnly aria-label="load queue" onClick={() => {
                setLoopTrack(!loopTrack); // if paused play, if playing pause
                console.log(loopTrack); // Paused: true | false
            }}><LoopIcon color={loopTrack ? "inherit" : "disabled"}/>
            </Button>
        </Tooltip>
    )
}

export default TrackLoop;