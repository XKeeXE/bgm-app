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
import BGMLoadSettings from "./BGMLoadSettings";
import BGMSaveSettings from "./BGMSaveSettings";

const { getAudioDurationInSeconds } = require('get-audio-duration');
let trackPath: string;
let trackName = '';
let saveQueueTimer = 0;

const path = "E:/BGM/";
const queueFile = "BGMQUEUE.txt";
const settingsFile = "Settings.txt";
const tracks = fs.readdirSync(path).map(item => item); // read all the tracks from directory declared in the path
    
function EndOfQueue() {
    console.log("WOO END OF QUEUE");
    // TODO {END OF THE PLAYLIST}
}

function BGMList() {
    const bgmPlayerRef = useRef<any>();
    const bgmIndex = useRef<number>(-1);
    const selectedBGMIndex = useRef(-1);
    const [playing, setPlaying] = useState<boolean>(true);
    const [currentUrl, setCurrentUrl] = useState<string>(trackPath);
    const [trackTitle, setTrackTitle] = useState<string>('None')
    const [durationString, setDurationString] = useState<string>('00:00');

    const bgm = useRef(tracks.map((_track, originalTrackIndex) => {
        return Object.assign(
            {index: originalTrackIndex}, // original index of the track
            {played: false} // has been played in current queue
            )
    }));

    const [bgmPlayer, setBGMPlayer] = useState({
        played: 0,
        seeking: false
    });
    
    const [savedSettings, setSavedSettings] = useState({
        path: '',
        volume: 1
    })
    
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
       var nextTrack = bgm.current.find((bgm: { played: boolean; }) => bgm.played === false); // find track
       console.log(nextTrack);
       if (nextTrack === undefined) {
           EndOfQueue();
           return;
        }
        bgmIndex.current = nextTrack?.index as number;
        PlayTrack(bgmIndex.current);
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
     * Will convert data from the json into the current bgm queue
    */
    function GetBGMJson() {
        const data = fs.readFileSync(queueFile, 'utf8') // read the file and put it in data
        let jsonBGM = JSON.parse(data); // parse the data into the json bgm variable
        // for every track in the json change the current bgm into the one in the json
        for (let index = 0; index < bgm.current.length; index++) {
            bgm.current[index] = jsonBGM[index];
        }
    }

    /**
     * Will set stringify current bgm into the json
    */
    function SetBGMJson() {
        let jsonBGM = JSON.stringify(bgm.current);
        fs.writeFileSync(queueFile, jsonBGM, 'utf8');
    }

    return (
        <>
        <div className="bgm-app">
            {/** Background stuff, like load previous settings and save current settings when closed */}
            <BGMLoadSettings settingsFile={settingsFile} savedSettings={savedSettings} setSavedSettings={setSavedSettings}/>
            <BGMSaveSettings settingsFile={settingsFile} savedSettings={savedSettings}/>
            <div className="top-side">
                {/** Buttons to manipulate the bgm */}
                <TrackPause playing={playing} setPlaying={setPlaying}/>
                <BGMShuffle bgm={bgm}/>
                <TrackSkip bgm={bgm} PlayTrack={PlayTrack} bgmIndex={bgmIndex}/>
                <BGMSaveQueue bgm={bgm}/>
                <BGMLoadQueue SetBGMJson={SetBGMJson} GetBGMJson={GetBGMJson} PlayNextInQueue={PlayNextInQueue}/>
                <BGMVolume savedSettings={savedSettings} setSavedSettings={setSavedSettings}/>
                <TrackSeek bgmPlayerRef={bgmPlayerRef} bgmPlayer={bgmPlayer} setBGMPlayer={setBGMPlayer}/>
                <div className="current-track">
                    <p className="current-track-name">{trackTitle}</p>
                    <p className="current-track-duration">{durationString}</p> 
                </div>
            </div>
            <div className="main">
                <div className="left-side">
                    <BGMCurrentQueue currentUrl={currentUrl} bgm={bgm} tracks={tracks}/>
                    <TrackThumbnail currentUrl={currentUrl}/>
                    <ReactPlayer ref={bgmPlayerRef} playing={playing} url={currentUrl} volume={savedSettings.volume} progressInterval={1000} width={0} height={0}
                    onStart={() => {
                        // if already played 5 tracks auto save the queue and set the timer back to 0, will save the queue before the current track is set true
                        if (saveQueueTimer == 5) {
                            saveQueueTimer = 0;
                            SetBGMJson(); // save it into the json
                            console.log("auto saved")
                        }
                        var currentTrack = bgm.current.findIndex(bgm => bgm.played === false); // Will find current queue index in the current track
                        if (currentTrack == -1) {
                            EndOfQueue()
                            return;
                        }
                        console.log(currentTrack);
                        bgmIndex.current = currentTrack;
                        bgm.current[bgmIndex.current].played = true; // set the current track as played
                        console.log(bgm.current[bgmIndex.current]);
                        saveQueueTimer++; // add 1 into the timer
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
                            console.log(bgm.current[bgmIndex.current])
                            bgm.current[bgmIndex.current].played = true;
                            PlayTrack(index)
                        }}>{item.replace('.mp3', '')}
                    </li>)}
                    </ul>
                </div>
            </div>
        </div>
        </>
    );
}


export default BGMList;