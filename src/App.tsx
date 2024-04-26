import './App.css'
import fs from 'fs'
import { useEffect, useRef, useState} from "react";
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
import { Card, CardBody, CardFooter, CardHeader, Divider, Spacer } from '@nextui-org/react';
import { ipcRenderer } from 'electron';
import BGMCheckDuplicate from './components/BGMCheckDuplicate';
import UIContextMenu from './components/UIContextMenu';
import TrackLoop from './components/TrackLoop';
import UISettings from './components/UISettings';

var mp3Duration = require('mp3-duration');
import pLimit from 'p-limit';
import BGMTableList from './components/BGMTableList';
import UINavbar from './components/UINavbar';
import BGMQueueTracker from './components/BGMQueueTracker';
import UICloseButton from './components/UICloseButton';

let trackPath: string;

const settingsFile = "Settings.txt";

function EndOfQueue() {
    console.log("WOO END OF QUEUE");
    // TODO {END OF THE PLAYLIST}
}

// Playable files must contain one of these format
enum TYPES {
    '.mp3',
    '.ogg',
    '.wav',
    length
}

// interface LanguageTranslations {
//     [key: string]: string;
// }

// const data: { [key: string]: LanguageTranslations } = require('./assets/languages.json');


function App() {
    const bgmIndex = useRef<number>(-1); // index in the current queue
    const listRef = useRef<any>(null); // ref to the bgm list
    const tableRef = useRef<any>(null); // ref to the table list
    const rowRef = useRef([]);
    const currentSelectedTrack = useRef<number>(-1); // index of the current select track
    // const saveQueueTimer = useRef(0); // auto save timer
    const playedTracks = useRef<any>([]); // array of the tracks played
    const [selectedTrack, setSelectedTrack] = useState<number>(0);
    const currentTrackTitle = useRef<string>('No Track Playing');
    // const [playing, setPlaying] = usevalue<boolean>(true); // to pause and resume ReactPlayer
    // const [muteBGM, setMuteBGM] = usevalue<boolean>(false); // to mute and unmute ReactPlayer
    // const [showVolume, setShowVolume] = usevalue<boolean>(false); // to show and hide volume
    const [currentUrl, setCurrentUrl] = useState<string>(trackPath); // current url of the current playing track
    const [language, setLanguage] = useState<string>(navigator.language);
    // const [openModal, setOpenModal] = usevalue<boolean>(true);
    // const [darkMode, setDarkMode] = usevalue<boolean>(window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    
    const [forceUpdate, setForceUpdate] = useState(false);
    
    const [savedSettings, setSavedSettings] = useState({
        path: 'E:/BGM/',
        volume: 1
    });
    
    const tracks = useRef(fs.readdirSync(savedSettings.path).map(item => item)); // read all the tracks from directory declared in the path    
    const bgm = useRef(tracks.current.map((_track, originalTrackIndex) => {
        return Object.assign(
            {index: originalTrackIndex}, // original index of the track
            {duration: '...'},
            {played: false} // has been played in current queue
        )
    }));
    
    const ScrollToIndex = (index: number) => {
        if (tableRef.current == undefined) {
            return;
        }

        const row: any = rowRef.current[index];
        const rows: any = rowRef.current;
        for (let rowsIndex = 0; tracks.current.length > rowsIndex; rowsIndex++) {
            rows[rowsIndex].style.background = '';
        }
        if (row) {
            row.style.background = 'rgba(255, 255, 255, 0.1)';
            row.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
    };
    
    // function getTranslatedText(key: string): string {
    //     const languageTranslations: LanguageTranslations | undefined = data[language];
        
    //     if (languageTranslations) {
    //       return languageTranslations[key] || 'Text not found';
    //     } else {
    //       return 'Language not found';
    //     }
    // }

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
    
    function getDuration(filePath: string) {
        return new Promise((resolve, reject) => {
            mp3Duration(filePath, (err: any, duration: number) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(duration);
                }
            });
        });
    }
    
    function CalculateTime(time: number) {
        let dateObj = new Date(time * 1000);
        let minutes = dateObj.getUTCMinutes();
        let seconds = dateObj.getSeconds();
        return (minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')); // ex: 01:34
    } 
    
    /**
     * Will find the next track that is still unplayed in the current queue.
     * @returns if next track gives undefined it means end of queue
    */
    function PlayNextInQueue() {
        var nextTrack = TranslateTrackToBGM(false) // find track
        console.log(nextTrack);
        if (nextTrack === undefined) {
            EndOfQueue();
            return;
        }
        bgmIndex.current = nextTrack?.index as number;
        PlayTrack(bgmIndex.current);
    }

    /**
     * Will translate the inserted index and convert it into a bgm index
     * @param value either number or boolean
     * @returns the BGM
     */
    function TranslateTrackToBGM(value: number | boolean) {
        if (typeof value === 'number') {
            return bgm.current.find((track: { index: number; }) => track.index == value);
        } else if (typeof value === 'boolean') {
            return bgm.current.find((track: { played: boolean; }) => track.played == false);
        }
    }

    function FindTrackToBGM(index: number) {
        return bgm.current.findIndex((track: { index: number; }) => track.index == index);
    }

    useEffect(() => {
        // ipcRenderer.send('sendPlayNextInQueue', PlayNextInQueue.toString());
 
        // const limit = pLimit(100);
        // const getMp3FilesDuration = async () => {
        //     for (let index = 0; index < tracks.current.length; index++) {
        //         console.log(index);
        //         try {
        //             const duration = await getDuration(savedSettings.path.concat(tracks.current[index]));
        //             // mp3Durations.current.push(duration);
        //             bgm.current[index].duration = CalculateTime(duration as number);
        //             // console.log(duration);
        //             // console.log(`Duration of ${track}: ${duration} seconds`);
        //         } catch (err) {
        //             // console.error(`Error getting duration for ${track}: ${err}`);
        //         }
        //     }
        //   }; 
        
        // getMp3FilesDuration()
        // Promise.all(tracks.current.map((track, index) => limit(() => getDuration(savedSettings.path.concat(track))).then((duration) => {
            //     bgm.current[index].duration = CalculateTime(duration as number);
            // })))
            
            
        }, [])
    
    /**
     * Will play the track by putting the name of the original track index and adding it the
     * correct file path, then set the file path as the current url which will automatically
     * play the track.
     * @param index the index which reprensents the original track index from tracks array
    */
    function PlayTrack(index: number) {
        // console.log(bgmIndex.current);   // <-- THE SAME, works with every other component EXCEPT BGMLIST
        // console.log(index);              // <-- THE SAME, works with every component
        let trackName = tracks.current[index]; // will give the name of the track of the given original index, ex: TYPES.mp3
        let trackPath = savedSettings.path.concat(trackName); // will combine the path of the file with the track name, ex: E:/BGM/TYPES.mp3
        let trackTitle = CheckTrackType(trackName) // track name without the format, (.mp3, .ogg, etc.)
        console.log("Now playing: " + tracks.current[index]);
        setSelectedTrack(index); // sets the selected item in the bgm list as the current track
        setCurrentUrl(trackPath); // will update the value and put the track path
        ScrollToIndex(index);
        currentTrackTitle.current = trackTitle;
        document.title = trackTitle // put the app title as the current playing item
        ipcRenderer.send('trackTitle', trackTitle); // send the track title to the main process
        if (playedTracks.current.includes(index) == false) {
            playedTracks.current.push(index);
        }
        var resultIndex = FindTrackToBGM(index);
        console.log("currently in the queue number: #" + resultIndex); // number in the current queue
        bgmIndex.current = resultIndex; // set the current bgmIndex as the result index for later use 
        //bg-gradient-to-b from-[#2e026d] to-[#15162c]
        //before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10
        bgm.current[resultIndex].played = true; // set the current track as played ** had to be moved from TrackPlay as unplayable tracks got in the way **
    }

    return (
        <>
        <div className='relative min-h-screen'>
            {/** Background stuff, like load previous settings and save current settings when closed */}
            {/* <UICloseButton/> */}
            <BGMLoadSettings settingsFile={settingsFile} savedSettings={savedSettings} setSavedSettings={setSavedSettings}/>
            <BGMSaveSettings settingsFile={settingsFile} savedSettings={savedSettings}/>
            <div className="flex flex-row">
                <div className='w-full h-full ml-4 mt-4'>
                    <Card className=' min-h-[200px] min-w-[290px] md:max-w-[300px] lg:max-w-[400px]' isFooterBlurred>
                        <TrackThumbnail currentUrl={currentUrl} width={300} height={200}/>
                        <CardFooter className='absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100'>
                            <p>{currentTrackTitle.current}</p>
                        </CardFooter>
                    </Card>
                    <BGMQueueTracker currentUrl={currentUrl} bgm={bgm} tracks={tracks} forceUpdate={forceUpdate} playedTracks={playedTracks} CheckTrackType={CheckTrackType}/>
                </div>
  
                <div className="flex flex-col">
                    {/** The list of the tracks */}
                    <BGMInputSearch tracks={tracks} ScrollToIndex={ScrollToIndex} currentSelectedTrack={currentSelectedTrack} setSelectedTrack={setSelectedTrack} CheckTrackType={CheckTrackType}/>
                    {tracks.current.length === 0 && <p>No BGM found</p>}
                    <BGMTableList tracks={tracks} bgm={bgm} currentTrackTitle={currentTrackTitle} forceUpdate={forceUpdate} setForceUpdate={setForceUpdate} playedTracks={playedTracks} 
                    tableRef={tableRef} rowRef={rowRef} selectedTrack={selectedTrack} CheckTrackType={CheckTrackType} PlayTrack={PlayTrack} TranslateTrackToBGM={TranslateTrackToBGM}/>
                    {/* <BGMList tracks={tracks} bgm={bgm} currentTrackTitle={currentTrackTitle} forceUpdate={forceUpdate} setForceUpdate={setForceUpdate} playedTracks={playedTracks} listRef={listRef} 
                    selectedTrack={selectedTrack} CheckTrackType={CheckTrackType} PlayTrack={PlayTrack}/> */}
                </div>
            </div>
            <UINavbar bgm={bgm} tracks={tracks} savedSettings={savedSettings} setSavedSettings={setSavedSettings} bgmIndex={bgmIndex} currentUrl={currentUrl} 
            language={language} setLanguage={setLanguage} playedTracks={playedTracks} currentSelectedTrack={currentSelectedTrack} setSelectedTrack={setSelectedTrack} 
            forceUpdate={forceUpdate} setForceUpdate={setForceUpdate} ScrollToIndex={ScrollToIndex} CheckTrackType={CheckTrackType} 
            PlayNextInQueue={PlayNextInQueue} PlayTrack={PlayTrack}/>
        </div>
        </>
    );
}

export default App;