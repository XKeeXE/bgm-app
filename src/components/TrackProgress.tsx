import { useEffect, useState } from "react";
import { useStore } from "../toolbox/store";

const TrackProgress = () => {

    const duration = useStore((state) => state.player.duration);
    const [currentTime, setCurrentTime] = useState<number>(0);

    // const { ConsoleLog } = useContext(BGMContext);
    

    useEffect(() => {
        window.api.onProgress((currentTime) => {
            setCurrentTime(currentTime);
        })
    }, [])

    /**
     * To calculate the time for the track
     * @param time the amount in miliseconds
     * @returns the track time in string (ex: 01:34)
     */
    // function CalculateTime(time: number) {
    //     let dateObj = new Date(time * 1000);
    //     let minutes = dateObj.getUTCMinutes();
    //     let seconds = dateObj.getSeconds();
        
    //     return (minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')); // ex: 01:34
    // } 

    return (
        <div className="w-full relative flex h-full">
            <input tabIndex={-1} className="w-full background-progress absolute h-full select-none cursor-none" type="range"/>
            <input tabIndex={-1} className="w-full slider-progress h-full cursor-pointer z-20"
            type="range"
            min={0}
            max={duration}
            step={1}
            value={currentTime}
            style={{ 
                '--value': `${(currentTime / duration) * 100}% `,
                } as React.CSSProperties}
            onChange={(e) => {window.api.seekTrack(parseFloat(e.target.value))}}
            />
        </div>
    );
}

export default TrackProgress;