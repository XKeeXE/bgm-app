import { Button } from "@nextui-org/react";

import SaveQueueIcon from '@mui/icons-material/Save';
import { ipcRenderer } from "electron";

const BGMSQModal = () => {
    return (
        <Button variant="light" size="sm" isIconOnly aria-label="load queue" onClick={() => {
            ipcRenderer.send('callSaveQueue');
        }}><SaveQueueIcon/>
        </Button>
    )
}

export default BGMSQModal;