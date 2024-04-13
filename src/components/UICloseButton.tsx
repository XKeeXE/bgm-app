import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import CloseIcon from '@mui/icons-material/Close';
import { ipcRenderer } from "electron";

const UICloseButton = () => {
    return (
        <>
        <Button className="absolute right-0 top-0" radius="full" variant="light" size="sm" isIconOnly aria-label="clear" onClick={() => {
            ipcRenderer.send('closeApp');
        }}><CloseIcon/>
        </Button>
        </>
    )

}

export default UICloseButton;