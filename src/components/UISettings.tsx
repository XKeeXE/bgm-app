import {  useContext, useEffect, useRef } from "react";
import { UI } from "./types/types";
import { BGMContext } from "../App";
import { Darkmode, Directory } from "./Icons";

//  : <Brightness fontSize='large' />,

const UISettings = () => {

    const { LoadTracks } = useContext(BGMContext);
    
    useEffect(() => {
        window.api.newHome((bgm, path) => {
            console.log(`New path: ${path}`)
            LoadTracks(bgm);
        })
    }, [])

    const settingsRef = useRef<HTMLDivElement>(null);

    const items: UI[] = [{
        key: 'Darkmode',
        tooltip: 'Change Theme',
        icon: <Darkmode fontSize='large'/>,
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
    // {
    //     key: "Download",
    //     tooltip: "Download Track",
    //     icon: <DownloadTrack fontSize="large" />,
    //     onClick: function (): void {
    //         console.log('clicklab;e');
    
    //     }
    // },
    // {
    //     key: "File",
    //     tooltip: "Move file",
    //     icon: <InsertFile fontSize='large' />,
    //     onClick: function (): void {
    //         console.log('clicklab;e');
    
    //     }
    // },
    {
        key: 'Home',
        tooltip: 'Directory',
        icon: <Directory fontSize='large' />,
        onClick: function (): void {
            window.api.selectHome();
        }
    }]
    
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
        // setIsVisible(true);
        Animation(-50, 0);
    };

    function handleHideSettings() {
        // setIsVisible(false);
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