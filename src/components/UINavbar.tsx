import { useContext, useEffect, useState } from "react";
import * as Icons from './Icons';

import { setting, UI } from "./types/types";
import { BGMContext } from "../App";

// enum Direction {
//     LEFT,
//     RIGHT
// }

const UINavbar = () => {

    const { bgm, currentTrack, queueTracker, focus, PlayNextInQueue, ForceUpdate, ScrollToIndex, ResetQueue, LoopTrack, ConsoleLog } = useContext(BGMContext);
    const [player, setPlayer] = useState({
        paused: false,
        muted: false,
        looped: false,
    })
    const [volume, setVolume] = useState<number>(1);

    const [currentThumbnail, setCurrentThumbnail] = useState<string>('');

    useEffect(() => {

        window.api.onLoaded((settings: setting) => {
            setVolume(settings.volume);
        })

        window.api.onTrackStarted(() => {
            setPlayer(prevPlayer => ({ ...prevPlayer, paused: false }));
        })

        window.addEventListener("keydown", InputControl);
        return () => {
            window.removeEventListener("keydown", InputControl);
        };
    }, [])

    useEffect(() => {
        window.api.pausePlayer(player.paused);
        ConsoleLog(`The player is now ${!player.paused ? 'playing' : 'paused'}`); // Playing: true | false
    }, [player.paused])

    useEffect(() => {

    }, [player.muted])

    useEffect(() => {

    }, [player.looped])

    useEffect(() => {
        window.api.changeVolume(volume);
    }, [volume])

    useEffect(() => {
        window.api.readThumbnail(currentTrack.url).then((thumbnail) => {
            setCurrentThumbnail(thumbnail as string);
        });
    }, [currentTrack])

    function InputControl(e: { keyCode: number;}) {
        if (focus.current) return;
        const { keyCode } = e;
        switch (keyCode) {
            case 32: // Space
                PlayPause();
                break;
            // case 76: // ?
            //     Loop();
            //     break;
            case 37: // Arrow left

                break;
            case 39: // Arrow right

                break;
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
        e.preventDefault();
    }

    // function ChangeVolume(direction: Direction) {
    //     let totalVolume = 0;
    //     switch (direction) {
    //         case Direction.LEFT:
    //             break;
    //         case Direction.RIGHT:
    //             break;

    //     }
    // }
    
    /**
     * Inserts the track that was played into an object that consists of only played tracks
     * @param track the track object from the bgm object
     */
    // function CheckPlayedTracks(track: any) {
    //     if (track.played == true) {
    //         playedTracks.current.push(track.index);
    //     }
    // }

    // const BGMCheckDuplicate = () => {

    //     // An exception enum for those tracks that have {-#} in their title
    //     enum EXCEPTIONS {
    //         'The Rising of the SHIELD HERO OST - Campbell 1-1',
    //         '04 - 3-31',
    //         'Mission in Snowdriftland Soundtrack - 03 - World 1-2',
    //         'Jumping Flash! OST 17 - World 5-3',
    //         length
    //     }
    
    //     const result = useRef<any>();
    //     return (
    //         <button onClick={() => {
    //             const regexp = /[-]\d+$/; // regexp to find tracks that end with -#
    //             let trackName: string;
    //             result.current = []; // array which contains duplicated tracks
    //             checkBGM: for (let index = 0; index < tracks.current.length; index++) { // check the bgm list for duplicates
    //                 trackName = CheckTrackType(tracks.current[index]); // remove the type format from track name
    //                 if (trackName.match(regexp) != null) { // if a track contains {-#}, then it must be a duplicate
    //                     for (let exceptionIndex = 0; exceptionIndex < EXCEPTIONS.length; exceptionIndex++) { // there are exceptions though where a track end with {-#} but no duplicate
    //                         if (trackName.localeCompare(EXCEPTIONS[exceptionIndex]) == 0) { // if exception detected, then skip to the next track
    //                             continue checkBGM; // skip to the next track
    //                         }
    //                     }
    //                     result.current.push(trackName); // insert the track name in the result array if not an exception and is a duplicate
    //                 }
    //             }
    //             console.log(result.current);
    //         }}><Icons.Duplicate/>
    //         </button>
    //     )
    // }

    // const BGMReset = () => {
    //     return (
    //         <button onClick={() => {
    //             for (let index = 0; index <= bgm.current.length; index++) {
    //                 bgm.current[index].played = false;
    //             }
    //             playedTracks.current = [];
    //         }}><Icons.Reset/>
    //         </button>
    //     )
    // }

    /**
     * Will convert current track as false then play the previous track
     * @param props 
     * bgm: contains the current queue to play
     * @returns a button to play the previous track
     */
    // const TrackBack = () => {
    //     return (
    //         <button onClick={() => {
    //             if (playedTracks.current.length == 0) {
    //                 return;
    //             }
    //             bgm[bgmIndex.current].played = false;
    //             console.log(bgm[bgmIndex.current]);
    //             // var currentTrack = bgm.findIndex((bgm: { played: boolean; }) => bgm.played == false); // find first track that is not played in current queue
    //             // var prevTrack = currentTrack - 1;
    //             // if (prevTrack == -1) {
    //             //     return;
    //             // }
    //             playedTracks.current.pop(); // pop current playing track
    //             console.log(playedTracks.current[playedTracks.current.length-1]);
    //             // PlayTrack(bgm[prevTrack].index); // play next unplayed track 
    //             PlayTrack(playedTracks.current[playedTracks.current.length-1]);

    //             // if (playedTracks.current.length == 0) {
    //             //     return;
    //             // }
    //             // bgm[bgmIndex.current].played = false;
    //             // console.log(bgm[bgmIndex.current]);
    //             // // var currentTrack = bgm.findIndex((bgm: { played: boolean; }) => bgm.played == false); // find first track that is not played in current queue
    //             // // var prevTrack = currentTrack - 1;
    //             // // if (prevTrack == -1) {
    //             // //     return;
    //             // // }
    //             // playedTracks.current.pop(); // pop current playing track
    //             // console.log(playedTracks.current.length);
    //             // console.log(playedTracks.current)
    //             // console.log(playedTracks.current[playedTracks.current.length - 1]);
    //             // // console.log(bgm[playedTracks.current[playedTracks.current.length-1]]);
    //             // // PlayTrack(bgm[prevTrack].index); // play next unplayed track 
    //             // // PlayTrack(playedTracks.current[playedTracks.current.length-1]);
    //             // PlayTrack(playedTracks.current[playedTracks.current.length-1].index);
    //             // console.log("prevTrack");
    //         }}><Icons.Back/>
    //         </button>
    //     );
    // }

    // function BGMVolume() {
    //     const handleVolumeChange = (value: any) => {
    //         savedSettings.volume = parseFloat(value.toString())
    //     }
    //     useEffect(() => {
    //         if (savedSettings.volume <= 0.1) {
    //             setVolumeType(0);
    //         } else if (savedSettings.volume > 0.1 && savedSettings.volume <= 0.5) {
    //             setVolumeType(1);
    //         } else {
    //             setVolumeType(2);
    //         }
    //     }, [savedSettings.volume])
    
    // }
    
    // function VolumeSwitch(): JSX.Element {
    //     switch(volumeType){
    //         case 0: return <Icons.VolumeMute/>
    //         case 1: return <Icons.VolumeDown/>
    //         case 2: return <Icons.VolumeUp/>
    //         default: return <></>
    //     }
    // }
    
    //     return (
    //         <>
    //         {/* <div className="absolute right-0 self-center w-[20%] flex align-middle justify-center max-w-[200px]" onMouseEnter={() => { // inspired by Youtube
    //             setShowVolume(true); // set show volume as true to show input
    //         }}>
    //             <Tooltip content={savedSettings.volume.toFixed(2)}>
    //                 <Button className="" variant="light" isIconOnly aria-label="volume button" onClick={() => {
    //                     setMuteBGM(!muteBGM); // mute the bgm
    //                 }}>
    //                     {muteBGM ? <VolumeOff/> : <BGMVolumeSwitch/>}
    //                 </Button>
    //             </Tooltip>
    //             <Slider 
    //                 className={"self-center translate-x-[100%] " + (showVolume ? " animate-[show-volume_0.1s_ease-in-out_0.08s_1_both]" : " animate-[hide-volume_0.1s_ease-in-out_1_both] ")}
    //                 aria-label="volume slider"
    //                 hideThumb
    //                 color="foreground"
    //                 size="md"
    //                 step={0.01} 
    //                 maxValue={1}
    //                 minValue={0}
    //                 value={savedSettings.volume}
    //                 onChange={handleVolumeChange}>
    //             </Slider>
    //         </div> */}
    
    //         {/* <div className="absolute right-6 self-center flex w-[15%] min-w-[100px] items-center">
    //             <Tooltip content={savedSettings.volume.toFixed(2)}>
    //                 <button onClick={() => {
    //                     setMuteBGM(!muteBGM); // mute the bgm
    //                 }}>
    //                     {muteBGM ? <Icons.VolumeOff/> : <BGMVolumeSwitch/>}
    //                 </button>
    //             </Tooltip>
    //             <Slider 
    //                 // className={"self-center translate-x-[100%] " + (showVolume ? " animate-[show-volume_0.1s_ease-in-out_0.08s_1_both]" : " animate-[hide-volume_0.1s_ease-in-out_1_both] ")}
    //                 aria-label="volume slider"
    //                 hideThumb
    //                 color="foreground"
    //                 size="md"
    //                 step={0.01} 
    //                 maxValue={1}
    //                 minValue={0}
    //                 value={savedSettings.volume}
    //                 onChange={handleVolumeChange}>
    //             </Slider>
    //         </div> */}
    
    //         </>
    //     );
    // }

    // const bgmControl: UI[] =  [{
    //     key: "Save",
    //     tooltip: "",
    //     icon: <Icons.SaveQueue/>,
    //     onClick: function (): void {
            
    //     }
    // }]

    function Shuffle() {
        queueTracker.current = -1
        const tracksArray = Array.from(bgm.values());
        for (let index = bgm.size - 1; index > 0; index--) {
            const pos = Math.floor(Math.random() * (index + 1));
            [tracksArray[index], tracksArray[pos]] = [tracksArray[pos], tracksArray[index]];
        }
        tracksArray.forEach((track, index) => {
            track.queue.pos = index; // Update pos based on the new order
            bgm.set(track.id, track); // Update the Map with the modified track
        });
        ResetQueue(tracksArray);
        // console.log('shuffled');
        ConsoleLog(`Queue shuffled`);
        ForceUpdate();
    }

    function PlayPause() {
        setPlayer(prevPlayer => ({ ...prevPlayer, paused: !prevPlayer.paused })); // if paused play, if playing pause
        // ScrollToIndex(currentSelectedTrack.current);
    }

    function Loop() {
        LoopTrack(!player.looped);
        window.api.loopPlayer(!player.looped);
        setPlayer({...player, looped: !player.looped}); // if paused play, if playing pause
        ConsoleLog(`Looping is now ${!player.looped}`); // Looping: true | false
    }

    function Prev() {
        // ForceUpdate();
        ScrollToIndex(currentTrack.id)
        // queueTracker.current--;
        // console.log(queueTracker.current);
        // ForceUpdate();
    }

    function Skip() {
        ConsoleLog('Skipped');
        PlayNextInQueue();
        // console.log("Skipped");
    }
    
    const trackControl: UI[] = [
        {
            key: "Shuffle",
            tooltip: "",
            icon: <Icons.Shuffle/>,
            onClick: Shuffle
        },
        {
            key: "Back",
            tooltip: "",
            icon: <Icons.Back/>,
            onClick: Prev
        },
        {
            key: "Play/Pause",
            tooltip: "",
            icon: player.paused ? <Icons.Play fontSize="large"/> : <Icons.Pause fontSize="large"/>,
            onClick: PlayPause
        },
        {
            key: "Skip",
            tooltip: "",
            icon: <Icons.Skip/>,
            onClick: Skip
        },
        {
            key: "Loop",
            tooltip: "",
            icon: <Icons.Loop/>,
            onClick: Loop
        }
    ]

    function VolumeType(): JSX.Element {
        return <Icons.VolumeUp/>
    }

    const playerControl: UI[] = [{
        key: "Volume",
        tooltip: "",
        icon: player.muted ? <Icons.VolumeMute/> : VolumeType(),
        onClick: function (): void {
            window.api.mutePlayer(!player.muted);
            setPlayer({...player, muted: !player.muted});
        }
    }]

    return (
        <div className='navbar col-span-4 '>
            <div className="navbar flex flex-row p-5 pl-12 pr-12 ">
                <div className=" basis-1/4 flex flex-row gap-2 pl-[6px]">
                    {/* <button className="ml-2">test</button> */}
                    <img className="rounded-sm aspect-video" src={currentThumbnail} height={50} width={50}/>
                </div>
                <div className="basis-2/4 flex flex-row justify-center gap-2"> 
                    {trackControl.map((item, index) => (
                        <button tabIndex={-1} key={item.key} onClick={item.onClick} onKeyDown={handleKeyDown} className={` w-[10%] max-w-[40px] aspect-square ${index === 2 ? 'border-2 rounded-full' : ''}`}>
                            {item.icon}
                        </button>
                    ))}
                </div>
                <div className=" basis-1/4 flex flex-row ">
                    {playerControl.map(item => (
                        <button tabIndex={-1} key={item.key} onClick={item.onClick} onKeyDown={handleKeyDown} className={`h-full aspect-square`}>
                            {item.icon}
                        </button>
                    ))}
                    <div className="w-full rounded-full relative flex h-full">
                        <input tabIndex={-1} className="w-full background-volume absolute h-full select-none cursor-none" type="range"/>
                        <input tabIndex={-1} className="w-full slider-volume h-full cursor-pointer z-20"
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        style={{ 
                            '--value': `${volume*100}% `,
                            } as React.CSSProperties}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        onMouseUp={() => {
                            window.api.saveSettings();
                        }}/>
                        <ruby className="select-none absolute w-full text-center bottom-0 text-xs">100 <rt>❘</rt></ruby>
                        <ruby className="select-none absolute w-full text-end ml-[9px] bottom-0 text-xs">200 </ruby>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UINavbar;