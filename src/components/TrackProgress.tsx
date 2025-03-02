import { useEffect, useState } from "react";

const TrackProgress = () => {

    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);

    useEffect(() => {

        window.api.onTrackStarted((duration) => {
            setDuration(duration);
            // console.log(duration);
        })

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

    // const gradientStyle = {
    //     background: `linear-gradient(to right, 
    //         rgba(67, 200, 100, 1) ${Math.min((currentTime / duration) * 100 * 0.1, 10.0)}%, 
    //         rgba(67, 220, 100, 1) ${Math.min((currentTime / duration) * 100 * 0.2, 30.0)}%, 
    //         rgba(67, 255, 100, 1) ${Math.min((currentTime / duration) * 100, 90.0)}%, 
    //         rgba(97, 255, 100, 1) 100%)`
    // };

    return (
        <input tabIndex={-1} className="w-full cursor-pointer"
            type="range"
            min={0}
            max={duration}
            step={1}
            value={currentTime}
            // style={{ background: `linear-gradient(90deg, #4caf50 ${currentTime}%, #ddd ${currentTime}%)`}}
            onChange={(e) => {
                window.api.seekTrack(parseFloat(e.target.value))
                // console.log(parseFloat(e.target.value));
            }}
            // onClick={(e) => setCurrentTime(parseFloat(e.target.value))}
        />
    );
}

export default TrackProgress;