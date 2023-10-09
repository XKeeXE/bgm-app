import { useRef, useState } from "react";
import ReactPlayer from "react-player/file";
import fs from 'fs'
import BGMShuffle from "./BGMShuffle";
import TrackSkip from "./TrackSkip";
import BGMLoadQueue from "./BGMLoadQueue";
import TrackThumbnail from "./TrackThumbnail";
import BGMSaveQueue from "./BGMSaveQueue";
import TrackPause from "./TrackPause";
import BGMVolume from "./BGMVolume";
import BGMCurrentQueue from "./BGMCurrentQueue";
import TrackSeek from "./TrackSeek";

let { getAudioDurationInSeconds } = require('get-audio-duration');

let path = "E:/BGM/"
let trackPath: string;
let trackName = '';
let bgmIndex = -1;
let originalTrackIndex = 0; 
let saveQueueTimer = 0;
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
    const videoRef = useRef<any>();
    const selectedBGMIndex = useRef(-1);

    const [bgmPlayer, setBGMPlayer] = useState({
        played: 0,
        seeking: false
    });
    
    const [currentUrl, setCurrentUrl] = useState<string>(trackPath);
    const [playing, setPlaying] = useState<boolean>(true);
    const [trackTitle, setTrackTitle] = useState<string>('None')
    const [durationString, setDurationString] = useState<string>('00:00');
    const [bgmVolume, setBGMVolume] = useState(0.5);

    const handleProgress = (state: any) => {
        if (!bgmPlayer.seeking) {
            setBGMPlayer(state);
        }
    }
    
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
        // if (ReactPlayer.canPlay(trackPath) == false) { // <- doesnt work with FILE:ERR_NOT_FOUND
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
        setTrackTitle(trackName.replace('.mp3', ''));
        document.title = trackName.replace('.mp3', '') // put the app title as the current playing item
    }
    
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
    
    /**
     * Load queue from json
     */
    function LoadQueue() {
        console.log("Queue Loaded")
        GetBGMJson(); // get bgm from json
        PlayNextInQueue(); // play the next unplayed track from the json
    }
    
    /**
     * Will find the next track index in the current queue and overwrite the current url that is playing
    */
    function SkipTrack() {
        // bgm[bgmIndex].played == true;
        console.log(bgmIndex);
        var nextTrack = bgm.findIndex((bgm: { played: boolean; }) => bgm.played === false); // find index
        console.log(bgm[nextTrack]);
        bgmIndex = bgm[nextTrack].index
        PlayTrack(bgmIndex);
        console.log("skipped");
        console.log(currentUrl);
    }
    
    /**
     * Will convert data from the json into the current bgm queue
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
                    <BGMVolume bgmVolume={bgmVolume} setBGMVolume={setBGMVolume}/>
                    <div className="current-track">
                        <p className="current-track-name">{trackTitle}</p>
                        <p className="current-track-duration">{durationString}</p> 
                    </div>
                    {/* <TrackSeek playerRef={videoRef}/> */}
                </div>
                <BGMCurrentQueue currentUrl={currentUrl} bgm={bgm} tracks={tracks}/>
                <TrackThumbnail className="track-thumbnail" url={currentUrl}/>
                <TrackSeek playerRef={videoRef} bgmPlayer={bgmPlayer}/>
                <ReactPlayer playing={playing} url={currentUrl} volume={bgmVolume}
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
                }}
                onEnded={() => {
                    PlayNextInQueue(); // Must find next track in the current queue
                }}
                onProgress={handleProgress}/>
            </div>
            <div className="right-side">
                {tracks.length === 0 && <p>No BGM found</p>}
                <ul className="bgm-list">
                    {tracks.map((item, index) => 
                    <li className={selectedBGMIndex.current === index ? 'list-group-item active' : 'list-group-item'} // <- el html no sirve en electron
                    key={item} onClick={() => { 
                        // Tengo que rework para que no se chupe el queue ya que cada vez que haces select quita uno del queue aunque ya habia hecho play
                        console.log("clicked");
                        console.log(index);
                        console.log(bgm[bgmIndex])
                        bgm[bgmIndex].played = true;
                        PlayTrack(index)
                    }}>{item.replace('.mp3', '')}
                </li>)}
                </ul>
            </div>
        </div>
        </>
    );
}


export default BGMList;