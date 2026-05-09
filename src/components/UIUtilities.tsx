import { useEffect, useState } from "react";
import { windowItems, bgmControl } from "../configs";
import { Icon } from "./general/buttons";

const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `[${hours}:${minutes}:${seconds}]`;
};

const UIUtilities = () => {

    const [consoleLog, setConsoleLog] = useState<string>(`${getCurrentTime()} ${"Welcome to BGM!"}`);

    useEffect(() => {
        window.general.onLog((message: string) => {
            setConsoleLog(prevLog => `${prevLog}\n${getCurrentTime()} ${message}`);
        });
    }, [])

    return (
        <div className='w-[calc(50px+20%)] flex flex-col '>
            <div className="windows-buttons titlebar flex flex-row justify-end ">
                {windowItems.map(item => (
                    <Icon key={item.key} icon={item.icon} onClick={item.onClick} className={`titlebar-buttons min-w-[30px] h-[29px] ${item.key === 'Close' ? 'hover:bg-red-500' : 'clickable'}`} />
                ))}
            </div>

            <div className="h-full border-2 m-2 border-black rounded-md">
                <textarea 
                    onDragStart={(e) => e.preventDefault()}
                    spellCheck="false"
                    readOnly
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
                    <Icon key={item.key} icon={item.icon} onClick={item.onClick} className="border-2 rounded-md p-1 hover:border-2 aspect-square" />
                ))}
            </div>
        </div>
    )
}

export default UIUtilities;