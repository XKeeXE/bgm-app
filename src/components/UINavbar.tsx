import { useEffect, useState } from "react";
import { useStore } from "../toolbox/store";
import { trackConfig, playerConfig } from "../configs";
import { Icon } from "./general/buttons";

const UINavbar = () => {

    const currentTrack = useStore(state => state.player.currentTrack);
    const volume = useStore(state => state.player.volume);
    const playing = useStore(state => state.player.playing);
    const loop = useStore(state => state.player.loop);
    const mute = useStore(state => state.player.mute);
    const playedQueueLength = useStore(state => state.player.playedQueue.length);
    const initialized = useStore(state => state.player.initialized);

    const trackControl = trackConfig(playing, loop, playedQueueLength, initialized);
    const playerControl = playerConfig(mute);

    const [currentThumbnail, setCurrentThumbnail] = useState<string>('');

    useEffect(() => {
        window.api.onTrackStarted(() => {
            useStore.getState().player.setPlaying(true);
        });
    }, [])

    useEffect(() => {
        window.api.readThumbnail(currentTrack.url).then((thumbnail) => {
            setCurrentThumbnail(thumbnail as string);
        });
    }, [currentTrack])

    function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
        e.preventDefault();
    }

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
                        <Icon key={item.key} icon={item.icon} onClick={item.onClick} onKeyDown={handleKeyDown} disabled={item.disabled} className={`w-[10%] max-w-[40px] aspect-square ${index === 2 ? 'border-2 rounded-full' : ''}`} />
                    ))}
                </div>
                <div className=" basis-1/4 flex flex-row ">
                    {playerControl.map(item => (
                        <Icon key={item.key} icon={item.icon} onClick={item.onClick} onKeyDown={handleKeyDown} className={`h-full aspect-square`} />
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
                        onChange={(e) => useStore.getState().player.setVolume(parseFloat(e.target.value))}
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