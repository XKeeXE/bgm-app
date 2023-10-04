import { useRef, useState } from "react";
import ReactPlayer from "react-player/file";
import fs from 'fs'
import BGMShuffle from "./BGMShuffle";
import TrackSkip from "./TrackSkip";
import BGMLoadQueue from "./BGMLoadQueue";
import TrackThumbnail from "./TrackThumbnail";
import BGMSaveQueue from "./BGMSaveQueue";
import BGMCurrentQueue from "./BGMCurrentQueue";
import TrackPause from "./TrackPause";

// import ReactPlayer from 'react-player
// import { DataGrid } from '@mui/x-data-grid';
// import styled from "@emotion/styled";

let { getAudioDurationInSeconds } = require('get-audio-duration');

let path = "E:/BGM/"
let trackPath: string;
let trackName = '';
let bgmIndex = -1;
let originalTrackIndex = 0; 
let saveQueueTimer = 0;
let queue: string[] = [];
const tracks = fs.readdirSync(path).map(item => item); // read all the tracks from directory declared in the path
const bgm = tracks.map(_track => {
    return Object.assign(
        {index: originalTrackIndex++}, // original index of the track
        {played: false} // has been played in current queue
        )
    });
    
    function EndOfQueue() {
        console.log("WOO END OF QUEUE");
        // TODO {END OF THE PLAYLIST}
    }
    
    function BGMList() {
        // const { playing, setPlaying } = props;
        // const videoRef = useRef<any>();
        const selectedBGMIndex = useRef(-1);
        const [currentUrl, setCurrentUrl] = useState<string>(trackPath);
        const [playing, setPlaying] = useState<boolean>(true);
        const [results, setResults] = useState<string>("None");
        const [durationString, setDurationString] = useState('');
        // const [selectedBGMIndex, setSelectedBGMIndex] = useState(-1);
        
        /**
         * Will find the next track that is still unplayed in the current queue and since every track
         * has the original track index inside it get it and play the track.
         * @returns if next track gives undefined which means end of queue as all track has been played
        */
       function PlayNextInQueue() {
           var nextTrack = bgm.find((bgm: { played: boolean; }) => bgm.played === false); // find track
           console.log(nextTrack);
           if (nextTrack === undefined) {
               EndOfQueue();
               return;
            }
            bgmIndex = nextTrack?.index as number;
            PlayTrack(bgmIndex);
        }
        
        // function Tracklength(track: any, index: number) {
            //     let trackDir = path.concat(track[index])
            //     let durationString = "";
            //     getAudioDurationInSeconds(trackDir).then((duration: any) => { // esto sirve pero da un local blah blah blah
            //         let dateObj = new Date(duration * 1000);
            //         let minutes = dateObj.getUTCMinutes();
            //         let seconds = dateObj.getSeconds();
            
        //         durationString = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
        //     })
        //     return durationString;
        // }
        
        /**
         * Shuffle by doing Fisher-Yates
        */
       function Shuffle() {
           for (let index = bgm.length - 1; index > 0; index--) {
               let j = Math.floor(Math.random() * (index + 1));
               [bgm[index], bgm[j]] = [bgm[j], bgm[index]];
            }
            console.log(bgm);
        }
        
        function LoadQueue() {
            console.log("Queue Loaded")
            GetBGMJson(); // get bgm from json
            PlayNextInQueue(); // play the next unplayed track from the json
        }

        /**
         * Will play the track by putting the name of the original track index and adding it the
         * correct file path, then set the file path as the current url which will automatically
         * play the track.
         * @param index the index which reprensents the original track index from tracks array
        */
       function PlayTrack(index: number) {
           trackName = tracks[index]; // will give the name of the track of the given original index, ex: test.mp3
           trackPath = path.concat(trackName); // will combine the path of the file with the track name, ex: E:/BGM/test.mp3
           // if (ReactPlayer.canPlay(trackPath) == false) { <- doesnt work with FILE:ERR_NOT_FOUND
           //     console.error(trackName + " cant be played");
           //     bgm[bgmIndex].played = true;
           //     return;
           // }
           getAudioDurationInSeconds(trackPath).then((duration: any) => { // bug when first loading queue
               let dateObj = new Date(duration * 1000);
               let minutes = dateObj.getUTCMinutes();
               let seconds = dateObj.getSeconds();

               setDurationString(minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')); // ex: 01:34
            })
            setCurrentUrl(trackPath); // will update the state and put the track path
            
        }
        
        function CurrentQueue() {
            SetBGMJson(); // CANT PRESS CURRENT QUEUE WHEN FIRST SELECTING QUEUE OR WILL OVERWRITE QUEUE
            GetBGMJson();
            const bgmQueue = []; // the array of tracks of the next 10 tracks if possible
            var tempIndex = 0; // times the for loop occured [min=1, max=10], 0 if none
            let currentQueue = 0; // how many tracks have played in the current queue
            let finalTrackIndex = 0; // named liked that because when for loop finishes will get the final index of the following 10 tracks
            let tracksIndex = 0;
            var queueTracks: any; // declared as var for organization for find index and find
            for (let index = 0; index < 10; index++) {
                queueTracks = bgm.findIndex((bgm: { played: boolean; }) => bgm.played === false); // get index of queue of the track in current queue
                if (bgm.length - queueTracks < 0 || queueTracks == -1 ) {
                    break;
                }
                finalTrackIndex = queueTracks; // when for loop finishes get the final track index
                currentQueue = queueTracks; // index of current queue
                queueTracks = bgm.find((bgm: { played: boolean; }) => bgm.played === false); // find the next track in the current queue
                if (queueTracks === undefined) { // since it is possible to give undefined when all tracks have been played break from the loop
                    break;
                }
                bgm[finalTrackIndex].played = true; // mark the bgm to played true to find next track
                bgmQueue.push(tracks[queueTracks.index]); // put the name of the tracks into the queue
                tempIndex = index+1; // add 1 into the times it ocurred for real life numbers [min=1, max=10] as for loop starts at 0 and ends on 9
            }
            // Since the tracks were marked true revert the process and mark it false the amount of tracks were marked true
            for (let index = tempIndex; index > 0; index--) {
                tracksIndex = finalTrackIndex - index; 
                bgm[tracksIndex+1].played = false; 
            }
            queue = bgmQueue.map(item => item)
            // console.log(queue)
            // console.log(bgmQueue);
            // console.log(tempIndex + " / " + (bgm.length - currentQueue) + " result(s) displayed");
            setResults(tempIndex + " / " + (bgm.length - currentQueue) + " result(s) displayed"); // <- el re-render hace que el queue haga display correctamente
        }
        
        /**
         * Will find the next track index in the current queue and overwrite the current url that is playing
        */
       function SkipTrack() {
           var nextTrack = bgm.findIndex((bgm: { played: boolean; }) => bgm.played === false); // find index
           bgmIndex = bgm[nextTrack].index
           PlayTrack(bgmIndex);
           console.log("skipped");
           console.log(currentUrl);
        }
        
        /**
         * Will convert data from the json into the current bgm queue
         * @param message of the current action
        */
       function GetBGMJson() {
           const data = fs.readFileSync('BGMQUEUE.txt', 'utf8') // read the file and put it in data
           let jsonBGM = JSON.parse(data); // parse the data into the json bgm variable
           // for every track in the json change the current bgm into the one in the json
           for (let index = 0; index < bgm.length; index++) {
               bgm[index] = jsonBGM[index];
            }
        }
        
        /**
         * Will set stringify current bgm into the json
         * @param message of current action
        */
        function SetBGMJson() {
            let jsonBGM = JSON.stringify(bgm);
            fs.writeFileSync('BGMQUEUE.txt', jsonBGM, 'utf8');
        }
        
        return (
            <>
            <div className="bgm-app">
                <div className="left-side">
                    <div className="top-side">
                        <TrackPause playing={playing} setPlaying={setPlaying}/>
                        <BGMShuffle shuffle={Shuffle}/>
                        <TrackSkip skip={SkipTrack}/>
                        <BGMSaveQueue bgm={bgm}/>
                        <BGMLoadQueue load={LoadQueue}/>
                        <div className="current-track">
                            <p className="current-track-name">{trackName.replace(".mp3", '')}</p>
                            <p className="current-track-duration">{durationString}</p> 
                        </div>
                        {/* <TrackSeek playerRef={videoRef}/> */}
                    </div>
                    {queue.length === 0 && <p>No current queue found</p>}
                    <ul className="bgm-queue">
                        {queue.map((item) => 
                        <li key={item}>{item.replace('.mp3', '')}
                        </li>)}
                    </ul>
                    <p className="bgm-results">{results}</p>
                    <TrackThumbnail className="track-thumbnail" url={currentUrl}/>
                        <ReactPlayer playing={playing} url={currentUrl} 
                        onStart={() => {
                            var currentTrack = bgm.findIndex(bgm => bgm.played === false); // Will find current queue index in the current track
                            if (currentTrack == -1) {
                                EndOfQueue()
                                return;
                            }
                            console.log(currentTrack);
                            bgmIndex = currentTrack;
                            bgm[bgmIndex].played = true; // set the current track as played
                            console.log(bgm[bgmIndex]);
                            saveQueueTimer++; // add 1 into the timer
                            // if already played 5 tracks auto save the queue and set the timer back to 0
                            if (saveQueueTimer == 5) {
                                saveQueueTimer = 0;
                                SetBGMJson(); // save it into the json
                                console.log("auto saved")
                            }
                            console.log(currentUrl); // url of the current playing track
                            CurrentQueue();
                        }}
                        onEnded={() => {
                            PlayNextInQueue(); // Must find next track in the current queue
                        }}/>
                </div>
                <div className="right-side">
                    {tracks.length === 0 && <p>No BGM found</p>}
                    <ul className="bgm-list">
                        {tracks.map((item, index) => 
                        <li className={selectedBGMIndex.current === index ? 'list-group-item active' : 'list-group-item'} // <- el html no sirve en electron
                        key={item} onClick={() => { 
                            // Un bug donde escoge el no el proximo sino el despues de ese
                            console.log("clicked");
                            // setSelectedBGMIndex(index); 
                            selectedBGMIndex.current = index;
                            bgmIndex = index;
                            // var nextTrack = bgm.findIndex(bgm => bgm.played === false); // Will find next queue index
                            PlayTrack(bgmIndex)
                        }}>{item.replace('.mp3', '')}
                    </li>)}
                    </ul>
                </div>
            </div>
            </>
    );
}


export default BGMList;