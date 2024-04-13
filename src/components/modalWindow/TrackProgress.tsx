import { Progress } from "@nextui-org/react";
import { ipcRenderer } from "electron";
import { useEffect, useRef, useState } from "react";

const TrackProgress = (props: any) => {
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
        <div className="flex w-[40vw]">
            <p className="pr-1 text-xs select-none">{trackCurrentTime}</p>
            <Progress
            size="sm"
            classNames={{
                indicator: 'bg-white'
            }}
            value={trackProgress}
            maxValue={0.999999}
            aria-label="progress"/>
            <p className="pl-1 text-xs select-none">{trackDuration.current}</p>
        </div>
        </>
    )
}

export default TrackProgress;