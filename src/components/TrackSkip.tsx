import { Button, Tooltip } from "@nextui-org/react";
import SkipIcon from '@mui/icons-material/SkipNext';

/**
 * // Will find the next track index in the current queue and overwrite the current url that is playing
 * @param props bgm, PlayTrack, bgmIndex
 * @returns the skip button
 */
const TrackSkip = (props: any) => {
    const { PlayNextInQueue } = props;
    return (
        <Tooltip content="Skip">
            <Button variant="light" size="lg" aria-label="skip" isIconOnly onClick={() => {
                PlayNextInQueue();
                console.log("Skipped");
            }}><SkipIcon />
            </Button>
        </Tooltip>
    );
}

export default TrackSkip;