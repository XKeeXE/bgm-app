import './App.css'
import { useRef, useState } from "react";
import fs from 'fs'
import BGMShuffle from "./components/BGMShuffle";
import TrackSkip from "./components/TrackSkip";
import BGMLoadQueue from "./components/BGMLoadQueue";
import TrackThumbnail from "./components/TrackThumbnail";
import BGMSaveQueue from "./components/BGMSaveQueue";
import TrackPause from "./components/TrackPause";
import BGMVolume from "./components/BGMVolume";
import BGMCurrentQueue from "./components/BGMCurrentQueue";
import BGMLoadSettings from "./components/BGMLoadSettings";
import BGMSaveSettings from "./components/BGMSaveSettings";
import TrackPlay from "./components/TrackPlay";
import BGMList from './components/BGMList';
import BGMInputSearch from './components/BGMInputSearch';
import TrackPrevious from './components/TrackPrevious';
import { Card, CardBody } from '@nextui-org/react';
import { ipcRenderer } from 'electron';
import BGMCheckDuplicate from './components/BGMCheckDuplicate';

let trackPath: string;

const queueFile = "BGMQUEUE.txt";
const settingsFile = "Settings.txt";

function EndOfQueue() {
    console.log("WOO END OF QUEUE");
    // TODO {END OF THE PLAYLIST}
}

// Playable files must contain one of these format
enum TYPES {
    '.mp3',
    '.ogg',
    length
}

function App() {
    const bgmIndex = useRef<number>(-1);
    const listRef = useRef<any>();
    const currentSelectedTrack = useRef<number>(-1);
    const saveQueueTimer = useRef(0);
    const playedTracks = useRef<number[]>([]); // array of the tracks played
    const [selectedTrack, setSelectedTrack] = useState<number>(-1);
    const [playing, setPlaying] = useState<boolean>(true);
    const [muteBGM, setMuteBGM] = useState(false);
    const [showVolume, setShowVolume] = useState(false);
    const [currentUrl, setCurrentUrl] = useState<string>(trackPath);
    
    const [savedSettings, setSavedSettings] = useState({
        path: 'E:/BGM/',
        volume: 1
    });
    
    const tracks = useRef(fs.readdirSync(savedSettings.path).map(item => item)); // read all the tracks from directory declared in the path    
    const bgm = useRef(tracks.current.map((_track, originalTrackIndex) => {
        return Object.assign(
            {index: originalTrackIndex}, // original index of the track
            {played: false} // has been played in current queue
            )
        }));

    /**
     * To remove track format from track title
     * @param track the track title
     * @returns either the unmodified track or the track without the format
     */
    function CheckTrackType(track: string) {
        for (let index = 0; index < TYPES.length; index++) {
            if (track.includes(TYPES[index], track.length-4) == true) {
                return track.replace(TYPES[index], '');
            }
        }
        return track;
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
        // console.log(bgmIndex.current);   // <-- THE SAME, but works with every other component EXCEPT BGMLIST
        // console.log(index);              // <-- THE SAME, works with every component
        
        let trackName = tracks.current[index]; // will give the name of the track of the given original index, ex: TYPES.mp3
        let trackPath = savedSettings.path.concat(trackName); // will combine the path of the file with the track name, ex: E:/BGM/TYPES.mp3
        let trackTitle = CheckTrackType(trackName) // track name without the format, (.mp3, .ogg, etc.)
        // if (ReactPlayer.canPlay(trackPath) == false) { // <- doesnt work with FILE:ERR_NOT_FOUND
        //     console.error(trackName + " cant be played");
        //     bgm.current[bgmIndex.current].played = true; <- wont even work
        //     return;
        // }
        console.log("Now playing: " + tracks.current[index]);
        setSelectedTrack(index); // sets the selected item in the bgm list as the current track
        setCurrentUrl(trackPath); // will update the state and put the track path
        document.title = trackTitle // put the app title as the current playing item
        ipcRenderer.send('track-title', trackTitle); // send the track title to the main process
        listRef.current.scrollToItem(index, "center"); // in the bgm list scrolls to the current track
        console.log(playedTracks.current[playedTracks.current.length-1]);
        if (playedTracks.current.includes(index) == false) {
            playedTracks.current.push(index);
        }
        // console.log(playedTracks.current);
        var resultIndex = bgm.current.findIndex((track: { index: number; }) => track.index == index); // find the index that has index == originalTrackIndex
        console.log("currently in the queue number: #" + resultIndex); // number in the current queue
        bgmIndex.current = resultIndex; // set the current bgmIndex as the result index for later use
        bgm.current[resultIndex].played = true; // set the current track as played ** had to be moved from TrackPlay as unplayable tracks got in the way **
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
        playedTracks.current = [];
        bgm.current.filter(CheckPlayedTracks);
    }

    function CheckPlayedTracks(track: any) {
        if (track.played == true) {
            playedTracks.current.push(track.index);
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
        <div className="absolute top-0">
            {/** Background stuff, like load previous settings and save current settings when closed */}
            <BGMLoadSettings settingsFile={settingsFile} savedSettings={savedSettings} setSavedSettings={setSavedSettings}/>
            <BGMSaveSettings settingsFile={settingsFile} savedSettings={savedSettings}/>
            <Card className=''>
                <CardBody>
                    <div className="md:max-2xl:flex md:max-[10px]:hidden">
                        <div className="w-max object-fill">
                            {/** To see the current queue and current thumbnail */}
                            <BGMCurrentQueue currentUrl={currentUrl} bgm={bgm} tracks={tracks} bgmIndex={bgmIndex} CheckTrackType={CheckTrackType}/>
                            <TrackThumbnail currentUrl={currentUrl} width={400} height={200}/>
                        </div>
                        <div className="right-side">
                            {/** The list of the tracks */}
                            {tracks.current.length === 0 && <p>No BGM found</p>}
                            <BGMList tracks={tracks} bgm={bgm} listRef={listRef} selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack} CheckTrackType={CheckTrackType} PlayTrack={PlayTrack}/>
                        </div>
                    </div>
                    
                </CardBody>
            </Card>
            {/** Buttons to manipulate the bgm */}
            <div className="fixed bottom-0 bg-gray-500/50 opacity-0.1 w-full p-3 flex place-content-center justify-center align-middle" onMouseLeave={() => {
                setShowVolume(false);
            }}>
                <div className='relative bottom-2 align-middle flex justify-center'>
                    <BGMInputSearch tracks={tracks} listRef={listRef} currentSelectedTrack={currentSelectedTrack} setSelectedTrack={setSelectedTrack} CheckTrackType={CheckTrackType}/>
                    <TrackPrevious playedTracks={playedTracks} bgm={bgm} bgmIndex={bgmIndex} PlayTrack={PlayTrack}/>
                    <TrackPause listRef={listRef} currentSelectedTrack={currentSelectedTrack} playing={playing} setPlaying={setPlaying} setSelectedTrack={setSelectedTrack}/>
                    <TrackSkip bgm={bgm} PlayTrack={PlayTrack}/>
                </div>
                <div className="absolute left-0 self-center">
                    {/* <p className='text-xs'>{trackTitle}</p>  */}
                    <BGMShuffle bgm={bgm}/>
                    <BGMLoadQueue SetBGMJson={SetBGMJson} GetBGMJson={GetBGMJson} PlayNextInQueue={PlayNextInQueue}/>
                    <BGMSaveQueue bgm={bgm} saveQueueTimer={saveQueueTimer}/>
                    <BGMCheckDuplicate tracks={tracks} CheckTrackType={CheckTrackType}/>
                </div>
                <BGMVolume muteBGM={muteBGM} setMuteBGM={setMuteBGM} showVolume={showVolume} setShowVolume={setShowVolume} savedSettings={savedSettings} setSavedSettings={setSavedSettings}/>
                {/** TrackPlay contains ReactPlayer component which is used to play the track */}
                <TrackPlay bgm={bgm} bgmIndex={bgmIndex} currentSelectedTrack={currentSelectedTrack} saveQueueTimer={saveQueueTimer} playing={playing} currentUrl={currentUrl} 
                muteBGM={muteBGM} savedSettings={savedSettings} SetBGMJson={SetBGMJson} EndOfQueue={EndOfQueue} PlayNextInQueue={PlayNextInQueue}/>
            </div>
        </div>
        </>
    );
}


export default App;