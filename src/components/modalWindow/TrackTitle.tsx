import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

const TrackTitle = (props: any) => {
    const [trackTitle, setTrackTitle] = useState('No current track');
    useEffect(() => {
        ipcRenderer.on('track-title', (e, title) => {
            setTrackTitle(title)
        });
    }, [])
    return (
        <p className='text-xs'>{trackTitle}</p>
    )
}

export default TrackTitle;