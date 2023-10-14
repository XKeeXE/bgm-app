import { IconButton, Tooltip } from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

/**
 * Will receive playing and setPlaying states to change the Reactplayer playing state
 * @param props playing, setPlaying
 * @returns the Pause button
 */
const TrackPause = (props: any) => {
    const { playing, setPlaying } = props;

    return (
        <Tooltip title={playing ? "Pause" : "Play"}>
            <IconButton onClick={() => {
                setPlaying(!playing); // if paused play, if playing pause
                console.log(playing); // Paused: true | false
            }}>{playing ? <PauseIcon/> : <PlayIcon/> }
            </IconButton>
        </Tooltip>
    );
}

export default TrackPause;