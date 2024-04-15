import { Progress } from "@nextui-org/react";
import { ipcRenderer } from "electron";
import { useEffect, useRef, useState } from "react";

const TrackProgress = () => {
    const trackDuration = useRef('00:00');
    const [trackCurrentTime, setTrackCurrentTime] = useState('00:00');
    const [trackProgress, setTrackProgress] = useState(0.0);

    useEffect(() => {
        ipcRenderer.on('trackProgressData', (_e, currentTime, progress, duration) => {
            trackDuration.current = duration;
            setTrackCurrentTime(currentTime);
            setTrackProgress(progress);
        })
        return () => {
            ipcRenderer.removeAllListeners('trackProgressData');
        }; 
        
    }, [])

    return (
        <>
        <div className="relative flex w-[100%]" style={{
            // background: 'red',
        }}>
            <p className="absolute left-0 top-1 text-xs select-none">{trackCurrentTime}</p>
            <Progress
            size="sm"
            // className="w-full"
            style={{
                width: '100%',
            }}
            classNames={{
                indicator: 'bg-white'
            }}
            value={trackProgress}
            maxValue={0.999999}
            aria-label="progress"/>
            <p className="absolute right-0 top-1 text-xs select-none">{trackDuration.current}</p>
        </div>
        </>
    )
}

export default TrackProgress;