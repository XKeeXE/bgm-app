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

        function PlayTrack(index: number) {
            trackName = tracks[index];
            trackPath = path.concat(trackName);
            setCurrentUrl(trackPath);
        }
    
        function PlayNextInQueue() {
            var nextTrack = bgm.find((bgm: { played: boolean; }) => bgm.played === false);
            console.log(nextTrack);
            if (nextTrack === undefined) {
                EndOfQueue();
                return;
            }
            bgmIndex = nextTrack?.index as number;
            PlayTrack(bgmIndex);
        }
        
        function SkipTrack() {
            var currentTrack = bgm.findIndex(bgm => bgm.played === false);
            bgmIndex = bgm[currentTrack].index
            PlayTrack(bgmIndex);
            console.log("skipped");
            console.log(currentUrl);
        }
    
        function GetBGMJson(message: string) {
            const data = fs.readFileSync('BGMQUEUE.txt', 'utf8')
            let jsonBGM = JSON.parse(data);
            for (let index = 0; index < bgm.length; index++) {
                bgm[index] = jsonBGM[index];
            }
            console.log(message);
        }
    
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
                const bgmQueue = [];
                var tempIndex = 0;
                let currentQueue = 0;
                let finalTrackIndex = 0; // Named liked that because when for loop finishes will get the final index of the following 10 tracks
                let tracksIndex = 0;
                var queueTracks: any;
                for (let index = 0; index < 10; index++) {
                    queueTracks = bgm.findIndex((bgm: { played: boolean; }) => bgm.played === false); // get index of queue of the track in current queue
                    // console.log(queueTracks);
                    // console.log(bgmIndex);
                    if (bgm.length - queueTracks < 0 || queueTracks == -1 ) {
                        break;
                    }
                    // console.log(bgm[queueTracks]);
                    finalTrackIndex = queueTracks;
                    currentQueue = queueTracks; // index of current queue
                    queueTracks = bgm.find((bgm: { played: boolean; }) => bgm.played === false); // find the next track in the current queue
                    if (queueTracks === undefined) {
                        break;
                    }
                    bgm[finalTrackIndex].played = true; // mark the bgm to played true to find next track
                    // console.log(queueTracks);
                    // console.log(queueTracks.index);
                    bgmQueue.push(tracks[queueTracks.index]);
                    // console.log(tracks[queueTracks.index]);
                    tempIndex = index+1;
                }
                // console.log(bgm);
                // Since the tracks were marked true revert the process and mark it false, times to revert the process
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
                GetBGMJson("read");
                PlayNextInQueue();
            }}>Load Queue</p>

            <p onClick={() => {
                // Shuffle
                for (let index = bgm.length - 1; index > 0; index--) {
                    let j = Math.floor(Math.random() * (index + 1));
                    [bgm[index], bgm[j]] = [bgm[j], bgm[index]];
                }
                console.log(bgm);
                SetBGMJson("saved");
            }}>ShuffleBGM</p>

            <img src={thumbnail}></img>

            <ReactPlayer playing={playing} url={currentUrl}
            onStart={() => {
                var currentTrack = bgm.findIndex(bgm => bgm.played === false); // Will find current queue index in the current track
                if (currentTrack == -1) {
                    EndOfQueue()
                    return;
                }
                // console.log(bgm[currentTrack+1]) // next track
                // works but gives deprecationWarning: buffer() is deprecated
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
                bgm[bgmIndex].played = true; // must be const to work
                console.log(bgm[bgmIndex]);
                saveQueueTimer++;
                // console.log(currentTrack);
                if (saveQueueTimer == 5) {
                    saveQueueTimer = 0;
                    SetBGMJson("auto save activated"); 
                }
                console.log(currentUrl);
                // console.log(bgm[bgmIndex].index);

            }}
            onEnded={() => {
                // Must find next track in the current queue and put the index to play the upcoming track
                PlayNextInQueue();
                }
            }/>
            <h1>List</h1>
                {tracks.length === 0 && <p>No BGM found</p>}
                <ul className="list-group">
                    {tracks.map((item, index) => 
                    <li className={selectedBGMIndex === index ? 'list-group-item active' : 'list-group-item'} 
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