import { Image } from "@nextui-org/react";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

const TrackThumbnailModal = () => {
    const [thumbnail, setThumbnail] = useState<string>('');

    useEffect(() => {
        ipcRenderer.on('trackThumbnail', (_e, base64) => {
            setThumbnail(base64);
        })
        return () => {
            ipcRenderer.removeAllListeners('trackThumbnail');
          };
    }, [])
    
    return (
        <>
        <Image src={thumbnail} className="w-full h-full" style={{
            // maxHeight: '50vw',
            // width: '55vw',
            minWidth: '280px',
            maxHeight: '90vh',
            maxWidth: '90vw',
        }}/>
        </>
    )
}

export default TrackThumbnailModal;