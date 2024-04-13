import { Button } from "@nextui-org/react";
import { ipcRenderer } from "electron";

const ModalButtons = (props: any) => {
    const { radius, size, variant, icon, ipcName} = props;
    return (
        <Button radius={radius} size={size} variant={variant} aria-label="pause" isIconOnly disableAnimation onClick={() => {
            ipcRenderer.send(ipcName);
        }}>{icon}
        </Button>
    )
}

export default ModalButtons;