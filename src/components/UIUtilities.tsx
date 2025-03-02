import { UI } from "./types/types";
import * as Icons from './Icons';
import { useContext, useEffect, useState } from "react";
import { BGMContext } from "../App";

const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `[${hours}:${minutes}:${seconds}]`;
};


const UIUtilities = () => {
    const { queueTracker, SyncQueue } = useContext(BGMContext);

    const [consoleLog, setConsoleLog] = useState<string>(`${getCurrentTime()} ${"Welcome to BGM!"}`);

    useEffect(() => {
        window.general.onLog((message: string) => {
            setConsoleLog(prevLog => `${prevLog}\n${getCurrentTime()} ${message}`);
        });
    }, [])

    const windowItems: UI[] = [
        {
            key: "Minimize",
            tooltip: "",
            icon: <Icons.Minimize/>,
            onClick: function (): void {

            }
        },
        {
            key: "Fullscreen",
            tooltip: "",
            icon: <Icons.Fullscreen/>,
            onClick: function (): void {

            }
        },
        {
            key: "Close",
            tooltip: "",
            icon: <Icons.Close/>,
            onClick: function (): void {
                window.api.quit();
            }
        }
    ]

    const bgmControl: UI[] = [{
        key: "Save",
        tooltip: "Save",
        icon: <Icons.SaveQueue/>,
        onClick: function (): void {
            SyncQueue('save');
        }
    },
    
    {
        key: "Load",
        tooltip: "Load",
        icon: <Icons.LoadQueue/>,
        onClick: function (): void {
            queueTracker.current = -1;
            SyncQueue('load');
            // ForceUpdate();
        }
    },
    {
        key: "Reset",
        tooltip: "Reset",
        icon: <Icons.Clipboard/>,
        onClick: function (): void {
            // SyncQueue('save');
        }
    },
    ]

    function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
        e.preventDefault();
    }

    return (
        <div className='w-[calc(50px+20%)] flex flex-col '>
            <div className="windows-buttons flex flex-row justify-end ">
                {windowItems.map(item => (
                    <button tabIndex={-1} className={`min-w-[30px] h-[29px] ${item.key === 'Close' ? 'hover:bg-red-500' : 'hover:bg-gray-300'}`} key={item.key} onClick={item.onClick}>
                        {item.icon}
                    </button>
                ))}
            </div>

            <div className="h-full border-2 m-2 border-black rounded-md">
                <textarea 
                    spellCheck="false"
                    tabIndex={-1} 
                    className="select-none h-full w-full bg-transparent text-xs resize-none" 
                    onChange={() => {}} 
                    value={consoleLog}
                    ref={(textarea) => {
                        if (textarea) {
                            textarea.scrollTop = textarea.scrollHeight;
                        }
                    }}
                />
            </div>

            <div className="flex flex-row gap-2 justify-evenly ">
                {bgmControl.map(item => (
                    <button tabIndex={-1} className="border-2 rounded-md p-1 hover:border-2 aspect-square" key={item.key} onClick={item.onClick}>
                        {item.icon}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default UIUtilities;