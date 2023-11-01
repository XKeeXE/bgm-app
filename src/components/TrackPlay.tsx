import { useRef, useState } from "react";
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
    const { bgm, bgmIndex, currentSelectedTrack, playing, currentUrl, savedSettings, SetBGMJson, PlayNextInQueue } = props;

    const bgmPlayerRef = useRef<any>();
    const [bgmPlayer, setBGMPlayer] = useState({
        played: 0,
        seeking: false
    });
    
    const handleProgress = (state: any) => {
        if (!bgmPlayer.seeking) {
            setBGMPlayer(state);
        }
    }

    return (
        <>
        <TrackSeek bgmPlayerRef={bgmPlayerRef} bgmPlayer={bgmPlayer} setBGMPlayer={setBGMPlayer}/>
        <ReactPlayer ref={bgmPlayerRef} playing={playing} url={currentUrl} volume={savedSettings.volume} progressInterval={200} width={0} height={0}
        onStart={() => {
            // var currentTrack = bgm.current.findIndex((bgm: { played: boolean; }) => bgm.played === false); // Will find current queue index in the current track
            // if (currentTrack == -1) {
            //     EndOfQueue()
            //     return;
            // }
            // console.log("currently in the queue number: #" + currentTrack);
            // bgmIndex.current = currentTrack;
            // if already played 5 tracks auto save the queue and set the timer back to 0, will save the queue before the current track is set true
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
        </>
    );
}

export default TrackPlay;