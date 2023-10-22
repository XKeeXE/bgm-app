import { IconButton, Tooltip } from '@mui/material';
import SkipIcon from '@mui/icons-material/SkipNext';

/**
 * // Will find the next track index in the current queue and overwrite the current url that is playing
 * @param props bgm, PlayTrack, bgmIndex
 * @returns the skip button
 */
const TrackSkip = (props: any) => {
    const { bgm, bgmIndex, trackSkipped, PlayTrack, EndOfQueue } = props;
    return (
        <Tooltip title="Skip">
            <IconButton onClick={() => {
                var nextTrack = bgm.current.findIndex((bgm: { played: boolean; }) => bgm.played === false); // find first track that is not played in current queue
                if (nextTrack == -1) {
                    EndOfQueue()
                    return;
                }
                console.log(bgm.current[nextTrack]);
                trackSkipped.current = true;
                bgm.current[nextTrack].played = true; // just in case the following track is not playable
                bgmIndex.current = bgm.current[nextTrack].index // convert bgmIndex into the original track index of the next track
                // console.log(bgmIndex.current);
                PlayTrack(bgmIndex.current); // play next track by inserting the original track index
                console.log("skipped");
            }}><SkipIcon/>
            </IconButton>
        </Tooltip>
    );
}

export default TrackSkip;