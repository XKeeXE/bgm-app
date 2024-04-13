import { Button } from "@nextui-org/react";
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

const TrackPreviousModal = () => {
    return (
        <Button variant="light" size="sm" aria-label="previous" isIconOnly onClick={() => {
            console.log("(Modal) prevTrack");
        }}><SkipPreviousIcon/>
        </Button>
    )
}

export default TrackPreviousModal;