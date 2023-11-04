import { Button, Tooltip } from "@nextui-org/react";
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

// WONT WORK IF TRACK SELECTED FROM BGM LIST
const TrackPrevious = (props: any) => {
    const { bgm, bgmIndex, PlayTrack } = props;
    return (
        <>
        <Tooltip content="SkipPrevious">
            <Button variant="light" size="lg" aria-label="reverse" isIconOnly onClick={() => {
                bgm.current[bgmIndex.current].played = false;
                var currentTrack = bgm.current.findIndex((bgm: { played: boolean; }) => bgm.played == false); // find first track that is not played in current queue
                var prevTrack = currentTrack - 1;
                if (prevTrack == -1) {
                    return;
                }
                PlayTrack(bgm.current[prevTrack].index); // play next unplayed track 
                console.log("prevTrack");
            }}><SkipPreviousIcon/>
            </Button>
        </Tooltip>
        </>
    );
}

export default TrackPrevious;