import {  useContext, useEffect, useRef } from "react";
import { UI, track } from "./Utils/types";
import { BGMContext } from "../App";
import * as Icons from "./Utils/Icons";

//  : <Brightness fontSize='large' />,

const UISettings = () => {

    const { bgm, LoadTracks, ForceUpdate, ConsoleLog } = useContext(BGMContext);
   
    const bgmRef = useRef(bgm);
    const settingsRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
        window.api.newHome((bgm, path) => {
            ConsoleLog(`New path: ${path}`)
            LoadTracks(bgm);
        })

        window.api.newLocalTracks((tracks: track[]) => {
            tracks.forEach(track => {
                bgmRef.current.set(track.id, track);
            });
            LoadTracks(bgmRef.current);
        })
    }, [])
    
    useEffect(() => {
        bgmRef.current = bgm;
    }, [bgm])

    const items: UI[] = [{
        key: 'Darkmode',
        tooltip: 'Change Theme',
        icon: <Icons.Darkmode fontSize='large'/>,
        onClick: function (): void {
            window.api.darkmode();
        }
    },
    // {
    //     key: 'Language',
    //     tooltip: 'Change language',
    //     icon: <Language fontSize='large' />,
    //     onClick: function (): void {
    //         console.log('test');
    //     }
    // },
    {
        key: "Local",
        tooltip: "Local Tracks",
        icon: <Icons.InsertFile fontSize='large'/>,
        onClick: function (): void {
            window.api.addLocalTracks(bgm.size);
            // ConsoleLog(bgm.size);
    
        }
    },
    {
        key: 'Home',
        tooltip: 'Directory',
        icon: <Icons.Directory fontSize='large' />,
        onClick: function (): void {
            window.api.selectHome();
        }
    },
    // {
    //     key: "YouTube",
    //     tooltip: "YouTube",
    //     icon: <Icons.Youtube fontSize='large' />,
    //     onClick: function (): void {
    //         console.log('clicklab;e');
    
    //     }
    // }
    ]
    
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
                    {items.map(item => (
                        <li key={item.key} className="relative tooltip first:mt-2 mb-4 cursor-pointer rounded-full border-2 border-dashed p-[2px]" onClick={item.onClick}>
                            <span className="tooltiptext left-[135%]">{item.tooltip}</span>
                            {item.icon}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        </>
    )
}

export default UISettings;