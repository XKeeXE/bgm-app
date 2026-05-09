import { useEffect, useRef } from "react";
import { useStore } from "../toolbox/store";
import { Track } from "../interfaces/store/player";
import { settingsItems } from "../configs";
import { Icon } from "./general/buttons";

//  : <Brightness fontSize='large' />,

const UISettings = () => {

    const settingsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.api.newHome((newBgm, path) => {
            window.general.log(`New path: ${path}`);
            useStore.getState().player.loadTracks(newBgm);
        });

        window.api.newLocalTracks((tracks: Track[]) => {
            const newBgm = new Map(useStore.getState().player.bgm);
            tracks.forEach(track => newBgm.set(track.id, track));
            useStore.getState().player.loadTracks(newBgm);
        });
    }, [])
    
    function CurrentTransform() {
        const currentTransform = getComputedStyle(settingsRef.current!).transform;
        const regex = /matrix\(1, 0, 0, 1, ([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?, 0\)/i;
        return currentTransform.match(regex)![1];
    }

    function Animation(transformA: number|string, transformB: number|string) {
        return (
            settingsRef.current!.animate(
                [
                    { transform: `translateX(${transformA}px)` },
                    { transform: `translateX(${transformB}px)` }
                ],
                {
                    duration: 220,
                    fill: 'forwards'
                }
            )
        )
    }

    function handleShowSettings() {
        Animation(-50, 0);
    };

    function handleHideSettings() {
        Animation(CurrentTransform(), -50);        
    };

    return (
        <>
        <div className="min-w-[50px] "/>
        <div className="settings-background absolute min-w-[50px] min-h-screen z-50" onMouseEnter={(handleShowSettings)} onMouseLeave={(handleHideSettings)}>
            <div ref={settingsRef} className={`settings relative translate-x-[-50px] min-h-screen toolbar`}>
                <ul className=" flex flex-col items-center">
                    {settingsItems.map(item => (
                        <li key={item.key} className="first:mt-2 mb-4">
                            <Icon icon={item.icon} tooltip={item.tooltip} onClick={item.onClick} className="cursor-pointer rounded-full border-2 border-dashed p-[2px]" />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        </>
    )
}

export default UISettings;