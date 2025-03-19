import { useContext, useEffect, useState } from "react";
import * as Icons from './Icons';

import { setting, UI } from "./types/types";
import { BGMContext } from "../App";

const UINavbar = () => {

    const { bgm, currentTrack, queueTracker, playedQueue, focus, PlayTrack, PlayNextInQueue, ForceUpdate, ResetQueue, LoopTrack, ConsoleLog } = useContext(BGMContext);
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
            window.api.offLoaded();
            window.api.offTrackStarted();
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
        if (playedQueue.current.length === 0) return;
        playedQueue.current.pop();
        currentTrack.queue.played = false;
        if (playedQueue.current.length === 0) {
            PlayTrack({
                    id: -1,
                    url: '',
                    title: '',
                    duration: undefined,
                    queue: {
                        pos: -1,
                        played: false
                    }
                },
            );
        } else {
            PlayTrack(bgm.get(playedQueue.current.pop()!.id)!)
        }
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
            icon: player.looped ? <Icons.Loop/> : <Icons.Loop htmlColor="gray"/>,
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
                    {currentThumbnail ? <img className="rounded-sm aspect-video" src={currentThumbnail} height={50} width={50}/> : null}
                    {/* <img className="rounded-sm aspect-video" src={currentThumbnail} height={50} width={50}/> */}
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