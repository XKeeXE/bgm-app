import { useState } from "react";
import ReactPlayer from "react-player/file";
import fs from 'fs'

var jsmediatags = require("jsmediatags");

let path = "E:/BGM/"
let trackPath: string;
let trackName: string;
let bgmIndex = -1;
let originaltrackIndex = 0;
let saveQueueTimer = 0;
const tracks = fs.readdirSync(path).map(item => item);
const bgm = tracks.map(_track => {
    return Object.assign(
        {index: originaltrackIndex++},
        {played: false}
        )
    })
    
    function EndOfQueue() {
        console.log("WOO END OF QUEUE");
        // TODO {END OF THE PLAYLIST}
    }
    
    function BGMList() {
        // console.log(bgm.length);
        const [currentUrl, setCurrentUrl] = useState<string>(trackPath);
        const [playing, setPlaying] = useState<boolean>(true);
        const [selectedBGMIndex, setSelectedBGMIndex] = useState(-1);
        const [thumbnail, setThumbnail] = useState<string>(currentUrl);
        
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

        /**
         * Will play the track by putting the name of the original track index and adding it the
         * correct file path, then set the file path as the current url which will automatically
         * play the track.
         * @param index the index which reprensents the original track index from tracks array
         */
        function PlayTrack(index: number) {
            trackName = tracks[index]; // will give the name of the track of the given original index, ex: test.mp3
            trackPath = path.concat(trackName); // will combine the path of the file with the track name, ex: E:/BGM/test.mp3
            setCurrentUrl(trackPath); // will update the state and put the track path
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
        function GetBGMJson(message: string) {
            const data = fs.readFileSync('BGMQUEUE.txt', 'utf8')
            let jsonBGM = JSON.parse(data);
            // for every track in the json change the current bgm into the one in the json
            for (let index = 0; index < bgm.length; index++) {
                bgm[index] = jsonBGM[index];
            }
            console.log(message);
        }
    
        /**
         * Will set stringify current bgm into the json
         * @param message of current action
         */
        function SetBGMJson(message: string) {
            let jsonBGM = JSON.stringify(bgm);
            fs.writeFileSync('BGMQUEUE.txt', jsonBGM, 'utf8');
            console.log(message);
        }
    
    return (
        <>
            <p onClick={() => {
                SetBGMJson("saved queue");
            }}>Save Queue</p>

            <p onClick={() => {
                SetBGMJson("Current"); // CANT DO THIS WHEN FIRST SELECTING QUEUE OR WILL OVERWRITE QUEUE
                GetBGMJson("Queue");
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
                // Since the tracks were marked true revert the process and mark it false how many tracks were marked true
                for (let index = tempIndex; index > 0; index--) {
                    tracksIndex = finalTrackIndex - index; 
                    bgm[tracksIndex+1].played = false; 
                }
                console.log(bgmQueue);
                console.log(tempIndex + " / " + (bgm.length - currentQueue) + " result(s) displayed");
            }}>Current Queue</p>

            <p onClick={() => {
                SkipTrack();
            }}>Skip</p>

            <p onClick={() => {
                // setPlaying(!playing)
                if (playing == false) {
                    setPlaying(true);
                    console.log("Resumed")
                } else {
                    setPlaying(false);
                    console.log("Paused")
                }
            }}>Pause</p>

            <p onClick={() => {
                GetBGMJson("read"); // get bgm from json
                PlayNextInQueue(); // play the next unplayed track from the json
            }}>Load Queue</p>

            <p onClick={() => {
                // Shuffle by doing Fisher-Yates
                for (let index = bgm.length - 1; index > 0; index--) {
                    let j = Math.floor(Math.random() * (index + 1));
                    [bgm[index], bgm[j]] = [bgm[j], bgm[index]];
                }
                console.log(bgm);
                SetBGMJson("saved"); // save it in the json
            }}>ShuffleBGM</p>

            <img src={thumbnail}></img>

            <ReactPlayer playing={playing} url={currentUrl}
            onStart={() => {
                var currentTrack = bgm.findIndex(bgm => bgm.played === false); // Will find current queue index in the current track
                if (currentTrack == -1) {
                    EndOfQueue()
                    return;
                }
                // works but gives deprecationWarning: buffer() is deprecated <- dont know how to fix
                // new jsmediatags.Reader(currentUrl).setTagsToRead(["picture"]).read({
                //     onSuccess: function(tag: any) {
                //         var image = tag.tags.picture;
                //         var base64String = "";
                //         for (var index = 0; index < image.data.length; index++) {
                //             base64String += String.fromCharCode(image.data[index]);
                //         }
                //         var base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
                //         setThumbnail(base64);
                //     },
                //     onError: function(error: any) {
                //         console.log(':(', error.type, error.info);
                //     }
                // })
                console.log(currentTrack);
                bgmIndex = currentTrack;
                bgm[bgmIndex].played = true; // set the current track as played
                console.log(bgm[bgmIndex]);
                saveQueueTimer++; // add 1 into the timer
                // if already played 5 tracks auto save the queue and set the timer back to 0
                if (saveQueueTimer == 5) {
                    saveQueueTimer = 0;
                    SetBGMJson("auto save activated"); // save it into the json
                }
                console.log(currentUrl); // url of the current playing track

            }}
            onEnded={() => {
                // Must find next track in the current queue
                PlayNextInQueue();
                }
            }/>
            <h1>List</h1>
                {tracks.length === 0 && <p>No BGM found</p>}
                <ul className="list-group">
                    {tracks.map((item, index) => 
                    <li className={selectedBGMIndex === index ? 'list-group-item active' : 'list-group-item'} // <- el html no sirve en electron
                    key={item} onClick={() => { 
                        // Un bug donde escoge el no el proximo sino el despues de ese
                        GetBGMJson("clicked");
                        setSelectedBGMIndex(index); 
                        bgmIndex = index;
                        var nextTrack = bgm.findIndex(bgm => bgm.played === false); // Will find next queue index
                        PlayTrack(bgmIndex)
                        console.log(nextTrack);
                }}>{item}
                </li>)}
            </ul>
            </>
    );
}


export default BGMList;