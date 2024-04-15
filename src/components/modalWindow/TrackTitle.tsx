import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

const TrackTitle = () => {
    const [trackTitle, setTrackTitle] = useState('No current track');
    useEffect(() => {
        ipcRenderer.on('trackTitle', (_e, title) => {
            setTrackTitle(title)
        });
        return () => {
            ipcRenderer.removeAllListeners('trackTitle');
        };
    }, [])

    return (
        <p className='text-xs font-custom font-semibold'>{trackTitle}</p>
    )
}

export default TrackTitle;