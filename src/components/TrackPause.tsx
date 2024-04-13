import { Button, Tooltip } from "@nextui-org/react";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { ipcRenderer } from "electron";
import { useEffect } from "react";

/**
 * Will receive playing and setPlaying states to change the Reactplayer playing state
 * @param props
 * listRef: reference to the bgm list to use scrollToItem and scroll to the resuming track
 * currentSelectedTrack: state to read the current selected track
 * playing & setPlaying: state to get and set the boolean of the playing track
 * @returns the Pause button
 */
const TrackPause = (props: any) => {
    const { listRef, currentSelectedTrack, playing, ScrollToIndex, setPlaying, setSelectedTrack } = props;
    
    useEffect(() => {
        ipcRenderer.on('updatePlaying', (_e, newState) => {
            setPlaying(newState);
        });
        return () => {
            ipcRenderer.removeAllListeners('updatePlaying');
          };
    }, [])
    return (
        <Tooltip content={playing ? "Pause" : "Play"}>
            <Button radius="full" size="lg" aria-label="pause" variant="ghost" isIconOnly onClick={() => {
                // setPlaying(!playing); // if paused play, if playing pause
                ipcRenderer.send('togglePlaying');
                listRef.current.scrollToItem(currentSelectedTrack.current, "center");
                // ScrollToIndex(currentSelectedTrack.current);
                // setSelectedTrack(currentSelectedTrack.current);
                console.log(playing); // Paused: true | false
            }}>{playing ? <PauseIcon /> : <PlayIcon/> }
            </Button>
        </Tooltip>
    );
}

export default TrackPause;