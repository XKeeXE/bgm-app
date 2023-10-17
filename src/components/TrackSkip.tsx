import { IconButton, Tooltip } from '@mui/material';
import SkipIcon from '@mui/icons-material/SkipNext'

/**
 * // Will find the next track index in the current queue and overwrite the current url that is playing
 * @param props bgm, PlayTrack, bgmIndex
 * @returns the skip button
 */
const TrackSkip = (props: any) => {
    const { bgm, PlayTrack, bgmIndex } = props;
    
    return (
        <Tooltip title="Skip">
            <IconButton onClick={() => {
                var nextTrack = bgm.current.findIndex((bgm: { played: boolean; }) => bgm.played === false); // find index
                bgm.current[nextTrack].played = true; // just in case the following track is not playable
                bgmIndex.current = bgm.current[nextTrack].index
                PlayTrack(bgmIndex.current);
                console.log("skipped");
            }}><SkipIcon/>
            </IconButton>
        </Tooltip>
    );
}

export default TrackSkip;