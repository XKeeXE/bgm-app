import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/file";
import TrackSeek from "./TrackSeek";

let saveQueueTimer = 0;

/**
 * This component contains the ReactPlayer component which is used to play the track, it contains bgmPlayerRef to get the
 * referance of the player, bgmIndex which contains the current queue index, bgmPlayer which is used to get the current
 * seconds on the current track, and handleProgress to see the current played seconds. It also contains the TrackSeek
 * component to seek forward or backwards if the user wishes to.
 * @param props 
 * @returns 
 */
const TrackPlay = (props: any) => {
    const { bgm, bgmIndex, currentSelectedTrack, playing, currentUrl, muteBGM, savedSettings, SetBGMJson, PlayNextInQueue } = props;

    const bgmPlayerRef = useRef<any>();
    const [trackDuration, setTrackDuration] = useState("00:00");
    const [trackCurrentTime, setTrackCurrentTime] = useState("00:00");
    const [bgmPlayer, setBGMPlayer] = useState({
        played: 0,
        seeking: false
    });
    
    const handleProgress = (state: any) => {
        if (!bgmPlayer.seeking) {
            setBGMPlayer(state);
        }
    }

    useEffect(() => {
        if (bgmPlayerRef.current != null) {
            setTrackCurrentTime(CalculateTime(bgmPlayerRef.current.getCurrentTime())); // state to set the current track time
            setTrackDuration(CalculateTime(bgmPlayerRef.current.getDuration())); // state to set the track duration
        }
    }, [bgmPlayer])

    function CalculateTime(time: number) {
        let dateObj = new Date(time * 1000);
        let minutes = dateObj.getUTCMinutes();
        let seconds = dateObj.getSeconds();
        
        return (minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')); // ex: 01:34
    } 

    return (
        <>
        <TrackSeek bgmPlayerRef={bgmPlayerRef} bgmPlayer={bgmPlayer} setBGMPlayer={setBGMPlayer}/>
        <ReactPlayer ref={bgmPlayerRef} playing={playing} url={currentUrl} volume={savedSettings.volume} muted={muteBGM} progressInterval={200} width={0} height={0}
        onStart={() => {
            console.log(bgm.current[bgmIndex.current])
            // if played x tracks auto save the queue and set the timer back to 0
            if (saveQueueTimer == 5) {
                saveQueueTimer = 0;
                SetBGMJson(); // save it into the json
                console.log("auto saved")
            }
            currentSelectedTrack.current = bgm.current[bgmIndex.current].index;
            saveQueueTimer++; // add 1 into the timer
            console.log(currentUrl); // url of the current playing track
        }}
        onEnded={() => {
            PlayNextInQueue(); // Must find next track in the current queue
        }}
        onProgress={handleProgress}/>
        {/* Current time in track and the track duration under the progress bar */}
        <div className='flex bottom-0 absolute justify-evenly'>
            <p className='text-xs w-96'>{trackCurrentTime}</p>
            <p className='text-xs'>{trackDuration}</p>
        </div>
        </>
    );
}

export default TrackPlay;