import { IconButton, Tooltip } from '@mui/material';
import SkipIcon from '@mui/icons-material/SkipNext';

/**
 * // Will find the next track index in the current queue and overwrite the current url that is playing
 * @param props bgm, PlayTrack, bgmIndex
 * @returns the skip button
 */
const TrackSkip = (props: any) => {
    const { bgm, PlayTrack, EndOfQueue } = props;
    return (
        <Tooltip title="Skip">
            <IconButton onClick={() => {
                var nextTrack = bgm.current.findIndex((bgm: { played: boolean; }) => bgm.played == false); // find first track that is not played in current queue
                if (nextTrack == -1) {
                    EndOfQueue()
                    return;
                }
                console.log(nextTrack);
                console.log(bgm.current[nextTrack]);
                PlayTrack(bgm.current[nextTrack].index); // play next unplayed track 
                console.log("skipped");
            }}><SkipIcon/>
            </IconButton>
        </Tooltip>
    );
}

export default TrackSkip;