// import { useRef, useState } from "react";
// import ReactPlayer from "react-player";

// let saveQueueTimer = 0;
// let trackPath: string;
// let trackName = '';

// const { getAudioDurationInSeconds } = require('get-audio-duration');

// const TrackPlay = (props: any) => {
//     const { tracks, bgm, savedSettings } = props;

//     const bgmPlayerRef = useRef<any>();
//     const bgmIndex = useRef<number>(-1);
//     // const selectedBGMIndex = useRef(-1);
//     const [playing, setPlaying] = useState<boolean>(true);
//     const [currentUrl, setCurrentUrl] = useState<string>(trackPath);
//     const [trackTitle, setTrackTitle] = useState<string>('None')
//     const [durationString, setDurationString] = useState<string>('00:00');

//     const [bgmPlayer, setBGMPlayer] = useState({
//         played: 0,
//         seeking: false
//     });
    
//     const handleProgress = (state: any) => {
//         if (!bgmPlayer.seeking) {
//             setBGMPlayer(state);
//         }
//     }

//     /**
//      * Will play the track by putting the name of the original track index and adding it the
//      * correct file path, then set the file path as the current url which will automatically
//      * play the track.
//      * @param index the index which reprensents the original track index from tracks array
//     */
//     function PlayTrack(index: number) {
//         trackName = tracks.current[index]; // will give the name of the track of the given original index, ex: test.mp3
//         trackPath = path.concat(trackName); // will combine the path of the file with the track name, ex: E:/BGM/test.mp3
//         // if (ReactPlayer.canPlay(trackPath) == false) { // <- doesnt work with FILE:ERR_NOT_FOUND
//         //     console.error(trackName + " cant be played");
//         //     bgm[bgmIndex].played = true;
//         //     return;
//         // }
//         getAudioDurationInSeconds(trackPath).then((duration: any) => { // bug when first loading queue
//             let dateObj = new Date(duration * 1000);
//             let minutes = dateObj.getUTCMinutes();
//             let seconds = dateObj.getSeconds();
            
//             setDurationString(minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')); // ex: 01:34
//         })
//         setCurrentUrl(trackPath); // will update the state and put the track path
//         setTrackTitle(trackName.replace('.mp3', ''));
//         document.title = trackName.replace('.mp3', '') // put the app title as the current playing item
//     }

//     /**
//      * Will find the next track that is still unplayed in the current queue and since every track
//      * has the original track index inside it get it and play the track.
//      * @returns if next track gives undefined which means end of queue as all track has been played
//     */
//     function PlayNextInQueue() {
//         var nextTrack = bgm.current.find((bgm: { played: boolean; }) => bgm.played === false); // find track
//         console.log(nextTrack);
//         if (nextTrack === undefined) {
//             EndOfQueue();
//             return;
//             }
//         bgmIndex.current = nextTrack?.index as number;
//         PlayTrack(bgmIndex.current);
//     }

//     return (
//         <>
//         <ReactPlayer ref={bgmPlayerRef} playing={playing} url={currentUrl} volume={savedSettings.volume} progressInterval={1000} width={0} height={0}
//         onStart={() => {
//             // if already played 5 tracks auto save the queue and set the timer back to 0, will save the queue before the current track is set true
//             if (saveQueueTimer == 5) {
//                 saveQueueTimer = 0;
//                 SetBGMJson(); // save it into the json
//                 console.log("auto saved")
//             }
//             var currentTrack = bgm.current.findIndex((bgm: { played: boolean; }) => bgm.played === false); // Will find current queue index in the current track
//             if (currentTrack == -1) {
//                 EndOfQueue()
//                 return;
//             }
//             console.log(currentTrack);
//             bgmIndex.current = currentTrack;
//             bgm.current[bgmIndex.current].played = true; // set the current track as played
//             console.log(bgm.current[bgmIndex.current]);
//             saveQueueTimer++; // add 1 into the timer
//             console.log(currentUrl); // url of the current playing track
//         }}
//         onEnded={() => {
//             PlayNextInQueue(); // Must find next track in the current queue
//         }}
//         onProgress={handleProgress}/>
//         </>
//     );
// }

// export default TrackPlay;