import { Button, Tooltip } from "@nextui-org/react";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

/**
 * Will receive playing and setPlaying states to change the Reactplayer playing state
 * @param props playing, setPlaying
 * @returns the Pause button
 */
const TrackPause = (props: any) => {
    const { listRef, currentSelectedTrack, playing, setPlaying } = props;

    return (
        <Tooltip content={playing ? "Pause" : "Play"}>
            <Button radius="full" size="lg" aria-label="pause" isIconOnly onClick={() => {
                setPlaying(!playing); // if paused play, if playing pause
                if (playing == false) {
                    listRef.current.scrollToItem(currentSelectedTrack.current, "center");
                }
                console.log(playing); // Paused: true | false
            }}>{playing ? <PauseIcon/> : <PlayIcon/> }
            </Button>
        </Tooltip>
    );
}

export default TrackPause;