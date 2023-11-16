import { Avatar, Image } from "@nextui-org/react";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

const TrackThumbnailModal = (props: any) => {
    const { width, height} = props;
    const [modalThumbnail, setModalThumbnail] = useState();

    useEffect(() => {
        ipcRenderer.on('track-thumbnail', (e, base64) => {
            setModalThumbnail(base64);
          })
    }, [])
    
    return (
        <>
        <Avatar className="absolute opacity-0" src={modalThumbnail} size="lg"/>
        <Image src={modalThumbnail} width={width}/>
        <img className="absolute opacity-0" src={modalThumbnail} width={width} height={height}/>
        </>
    )
}

export default TrackThumbnailModal;