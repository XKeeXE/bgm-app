import { Button } from "@nextui-org/react";
import { ipcRenderer } from "electron";
import SkipIcon from '@mui/icons-material/SkipNext';

const TrackSkipModal = () => {
    return (
        <Button variant="light" size="sm" aria-label="skip" isIconOnly onClick={() => {
            // ipcRenderer.invoke('playNextInQueue')
            console.log("(Modal) Skipped");
        }}><SkipIcon />
        </Button>
    )

}

export default TrackSkipModal;