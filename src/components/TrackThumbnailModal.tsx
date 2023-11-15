import { ipcRenderer } from "electron";
import { useState } from "react";

const TrackThumbnailModal = (props: any) => {
    const [modalThumbnail, setModalThumbnail] = useState();

    ipcRenderer.on('track-thumbnail', (e, data) => {
        console.log(data);
        setModalThumbnail(data);
      })
    
    return (
        <img src={modalThumbnail}></img>
    )
}

export default TrackThumbnailModal;