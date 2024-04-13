import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/file";
import TrackSeek from "./TrackSeek";
import { ipcRenderer } from "electron";

/**
 * This component contains the ReactPlayer component which is used to play the track and it also contains the TrackSeek
 * component to seek forward or backwards if the user wishes to.
 * bgmPlayerRef: get the reference of ReactPlayer to get current track time, get the duration of the track, and to use seek
 * trackDuration: state to get and set the track duration
 * trackCurrentTime: state to get and set the track current time
 * bgmPlayer: state to get and set the played amount and if its seeking
 * @param props 
 * bgm: contains the current queue to play
 * bgmIndex: current queue index
 * currentSelectedTrack: the current selected track
 * saveQueueTimer: the amount of times needed to auto save the queue
 * playing: state to pause the track
 * currentUrl: the current track in the directory path
 * muteBGM: state to mute the track
 * savedSettings: the settings saved
 * setBGMJson: function to save the bgm in a text file
 * PlayNextInQueue: function to play the next track in the queue
 * @returns 
 */
const TrackPlay = (props: any) => {
    const { bgm, bgmIndex, currentSelectedTrack, saveQueueTimer, playing, currentUrl, muteBGM, loopTrack, savedSettings, ScrollToIndex, SetBGMJson, PlayNextInQueue } = props;
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
    
    useEffect(() => { // if app already started, then calculate the current time
        if (bgmPlayerRef.current != null) {
            setTrackCurrentTime(CalculateTime(bgmPlayerRef.current.getCurrentTime())); // state to set the current track time
            ipcRenderer.send('trackProgressData', trackCurrentTime, bgmPlayer.played, trackDuration);
        }
    }, [bgmPlayer])

    /**
     * To calculate the time for the track
     * @param time the amount in miliseconds
     * @returns the track time in string (ex: 01:34)
     */
    function CalculateTime(time: number) {
        let dateObj = new Date(time * 1000);
        let minutes = dateObj.getUTCMinutes();
        let seconds = dateObj.getSeconds();
        
        return (minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')); // ex: 01:34
    } 

    return (
        <>
        <TrackSeek bgmPlayerRef={bgmPlayerRef} trackCurrentTime={trackCurrentTime} trackDuration={trackDuration} bgmPlayer={bgmPlayer} setBGMPlayer={setBGMPlayer}/>
        <ReactPlayer ref={bgmPlayerRef} playing={playing} url={currentUrl} volume={savedSettings.volume} muted={muteBGM} progressInterval={200} width={0} height={0}
        onError={() => {
            PlayNextInQueue(); // cannot play the selected track so we skip to the next one
        }}
        onStart={() => {
            setTrackDuration(CalculateTime(bgmPlayerRef.current.getDuration())); // state to set the track duration
            console.log(bgm.current[bgmIndex.current])
            // if played x tracks auto save the queue and set the timer back to 0
            if (saveQueueTimer.current == 5) {
                saveQueueTimer.current = 0;
                SetBGMJson(); // save it into the json
                console.log("auto saved")
            }
            currentSelectedTrack.current = bgm.current[bgmIndex.current].index;
            saveQueueTimer.current++; // add 1 into the timer
            console.log(currentUrl); // url of the current playing track
        }}
        onEnded={() => {
            if (loopTrack == false) {
                PlayNextInQueue(); // Must find next track in the current queue
            } else {
                bgmPlayerRef.current?.seekTo(0);
            }
        }}
        onProgress={handleProgress}/>
        </>
    );
}

export default TrackPlay;