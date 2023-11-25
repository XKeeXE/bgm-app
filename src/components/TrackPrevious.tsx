import { Button, Tooltip } from "@nextui-org/react";
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

/**
 * Will convert current track as false then play the previous track
 * @param props 
 * bgm: contains the current queue to play
 * @returns a button to play the previous track
 */
const TrackPrevious = (props: any) => {
    const { playedTracks, bgm, bgmIndex, PlayTrack } = props;
    return (
        <>
        <Tooltip content="Previous">
            <Button variant="light" size="lg" aria-label="previous" isIconOnly onClick={() => {
                bgm.current[bgmIndex.current].played = false;
                console.log(bgm.current[bgmIndex.current]);
                // var currentTrack = bgm.current.findIndex((bgm: { played: boolean; }) => bgm.played == false); // find first track that is not played in current queue
                // var prevTrack = currentTrack - 1;
                // if (prevTrack == -1) {
                //     return;
                // }
                if (playedTracks.current.length == 0) {
                    return;
                }
                playedTracks.current.pop(); // pop current playing track
                console.log(playedTracks.current[playedTracks.current.length-1]);
                // PlayTrack(bgm.current[prevTrack].index); // play next unplayed track 
                PlayTrack(playedTracks.current[playedTracks.current.length-1]);
                console.log("prevTrack");
            }}><SkipPreviousIcon/>
            </Button>
        </Tooltip>
        </>
    );
}

export default TrackPrevious;