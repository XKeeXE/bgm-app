import './App.css'
import { createContext, MutableRefObject, useState, useRef, useEffect } from "react";
import UISettings from './components/UISettings';

import BGMTableList from './components/BGMTableList';
import UINavbar from './components/UINavbar';
import { setting, track } from './components/types/types';
import BGMQueue from './components/BGMQueue';

// import defaultThumbnail from './assets/NoTrackThumbnail.png';
import UIUtilities from './components/UIUtilities';
import MinHeap from './components/types/MinHeap';
import TrackProgress from './components/TrackProgress';

export const BGMContext = createContext<{
    bgm: Map<number, track>;
    currentTrack: track;
    bgmQueue: MutableRefObject<MinHeap>,
    playedQueue: MutableRefObject<track[]>,
    queueTracker: MutableRefObject<number>,
    focus: MutableRefObject<boolean>,
    forceUpdate: boolean,
    LoadTracks: (bgm: Map<number, track>) => void,
    PlayTrack: (track: track) => void,
    PlayNextInQueue: () => void,
    ForceUpdate: () => void,
    SyncQueue: (type?: 'save' | 'load') => void,
    ScrollToIndex: (index: number) => void,
    LoopTrack: (loop: boolean) => void,
    ResetQueue: (values: IterableIterator<track> | track[]) => void,
    ConsoleLog: (message: string) => void,
}>({
    bgm: new Map<number, track>(), // Initialize with an empty Map
    currentTrack: {
        id: -1,
        url: '',
        title: '',
        duration: undefined,
        queue: {
            pos: -1,
            played: false
        }
    },
    playedQueue: { } as MutableRefObject<track[]>,
    bgmQueue: {} as MutableRefObject<MinHeap>,
    queueTracker: { current: -1 } as MutableRefObject<number>,
    focus: {} as MutableRefObject<boolean>,
    forceUpdate: false,
    LoadTracks: () => {},
    PlayTrack: () => {},
    PlayNextInQueue: () => {},
    LoopTrack: () => {},
    ForceUpdate: () => {},
    SyncQueue: () => {},
    ScrollToIndex: () => {},
    ResetQueue: () => {},
    ConsoleLog: () => {},
});

function App() {
    const queueTracker = useRef<number>(-1);
    const saveQueueTimer = useRef(0); // auto save timer
    const loadedSettings = useRef<setting>();
    const looped = useRef<boolean>(false);
    const focus = useRef<boolean>(false);
    const playedQueue = useRef<track[]>([]);

    const [forceUpdate, setForceUpdate] = useState<boolean>(false);

    const [currentTrack, setCurrentTrack] = useState<track>({
        id: -1,
        url: '',
        title: '',
        duration: undefined,
        queue: {
            pos: -1,
            played: false
        }
    });

    function ConsoleLog(message: string) {
        console.log(message);
        window.general.log(message);
    }

    // function GetLanguage(): string {
    //     if (localStorage.getItem('language')) return localStorage.getItem('language') as string;
    //     switch(navigator.language) {
    //         case 'en': return 'en'
    //         case 'es': return 'es'
    //         case 'ja': return 'ja'
    //         default: return 'en'
    //     }
    // }

    // const [language, setLanguage] = useState<string>(GetLanguage());

    // const savedSettings = useRef({
    //     path: 'E:/BGM/',
    //     volume: Number(localStorage.getItem('volume')) || 1
    // });

    const data = useRef<track[]>([]);
    const [bgm, setBgm] = useState<Map<number, track>>(new Map());
    const bgmQueue = useRef(new MinHeap());

    useEffect(() => {

        window.api.onLoaded((settings: setting) => {
            loadedSettings.current = settings;
            window.api.loadReady();
        })

        window.api.loadTracks().then(bgmData => {
            LoadTracks(bgmData);
        });

        window.api.onTrackStarted(() => {
            if (!looped.current) {
                if (saveQueueTimer.current == 5) {
                    saveQueueTimer.current = 0;
                    SyncQueue('save');
                } else {
                    saveQueueTimer.current++; // add 1 into the timer
                }
            }
        })
        
        // DISABLE React.StrictMode FOR THIS TO WORK CORRECTLY!!!
        window.api.onTrackEnded(() => {
            if (!looped.current) {
                PlayNextInQueue();
            } else {
                window.api.loopPlayer(looped.current);
            }
        })

        window.api.onError(() => {
            ConsoleLog(`Error occurred on playing track: ${currentTrack.url}`);
            PlayNextInQueue(); 
        })

        return () => {  
            window.api.offLoaded();
            window.api.offTrackStarted();
            window.api.offTrackEnded();
            window.api.offError();
        }
    }, []);

    useEffect(() => {
        if (currentTrack.url) {
            window.api.playTrack(currentTrack.url);
        }
    }, [currentTrack])

    useEffect(() => {
        data.current = [...bgm.values()];
    }, [bgm, forceUpdate, currentTrack])

    function LoadTracks(bgmData: Map<number, track>) {
        saveQueueTimer.current = 0;
        data.current = [...bgmData.values()];
        setBgm(bgmData);
        ResetQueue(bgmData.values());
    }
    
    function SyncQueue(type?: 'save' | 'load') {
        switch (type) {
            case 'save': {
                window.api.saveQueue(new Map(data.current.map((track: track) => [track.id, track])));
                ConsoleLog(`Queue saved`);
                break;
            }
            case 'load': {
                window.api.loadQueue().then(bgmData => {
                    LoadTracks(bgmData)
                    PlayNextInQueue();
                });
                break;
            }
            default: {
                window.api.saveQueue(new Map(data.current.map((track: track) => [track.id, track])));
                window.api.loadQueue().then(bgmData => {
                    LoadTracks(bgmData)
                });
            }
        }
    }

    function ForceUpdate() {
        setForceUpdate(!forceUpdate);
    }
    
    function ScrollToIndex(index: number) {
        const customEvent = new CustomEvent('handleTrackScroll', {
            detail: {index: index},
            }); 
        window.dispatchEvent(customEvent)
    }

    function LoopTrack(loop: boolean) {
        looped.current = loop;
    }
    
    function ResetQueue(tracks: IterableIterator<track> | track[]) {
        bgmQueue.current.clear();
        for (let track of tracks) {
            if (!track.queue.played) {
                bgmQueue.current.insert(track);
            }
        }
    }
    
    function EndOfQueue() {
        // TODO {END OF THE PLAYLIST}
        ConsoleLog("End of the playlist");
    }
    
    /**
     * Will find the next track that is still unplayed in the current queue.
    */
    function PlayNextInQueue() {
        const nextTrack = bgmQueue.current.extractMin();
        nextTrack ? PlayTrack(nextTrack) : EndOfQueue()
    }

    /**
     * Will play the track
     * @param index the index which reprensents the original track index from tracks array
     * @param type the type of play, queue == for queue, instant == no connection with the order of the queue
     */
    function PlayTrack(track: track) {
        if (queueTracker.current > -1) {
            queueTracker.current--;
        }
        console.log(track);
        track.queue.played = true;
        playedQueue.current.push(track);
        bgm.set(track.id, track); 
        ConsoleLog(`Now playing: ${track.title}`)
        document.title = track.title;
        setCurrentTrack(track);
    }

    return (
        <BGMContext.Provider value={{ 
            bgm, 
            currentTrack, 
            bgmQueue, 
            playedQueue,
            queueTracker, 
            focus,
            forceUpdate, 
            LoadTracks, 
            PlayTrack, 
            PlayNextInQueue, 
            ForceUpdate, 
            SyncQueue, 
            LoopTrack, 
            ResetQueue, 
            ScrollToIndex,
            ConsoleLog
            }}>
            <div className='main-background h-screen flex flex-col'>
                <div className='flex flex-row flex-grow '>
                    <UISettings />
                    <div className='w-full overflow-hidden ' >
                        <div className='current-track h-[30px] select-none' draggable={false}>
                            <span className='pl-2 font-renogare line-clamp-1'>{currentTrack.title ? currentTrack.title : 'BGM App (Vite + React + TS)'}</span>
                        </div>
                        <div className="flex flex-row h-[calc(100%-30px)] ">
                            <div className='flex flex-col max-w-[20%] min-w-[20%] h-full '>
                                <BGMQueue />
                            </div>
                            <div className='main w-full flex flex-col'>
                                <div className='w-full h-full '>
                                    <BGMTableList data={data.current} />
                                </div>
                                <div className='flex w-full items-end '>
                                    <TrackProgress />
                                </div>
                            </div>
                        </div>    
                    </div>
                    <UIUtilities />
                </div>
                <UINavbar />
            </div>
            {/* <BGMTableList data={data.current} /> */}
        </BGMContext.Provider>
    )
}

export default App;