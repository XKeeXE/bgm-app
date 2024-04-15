import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

const TracksQueue = () => {

    const [results, setResults] = useState<number>(0);

    useEffect(() => {
        ipcRenderer.on('tracksQueue', (_e, tracksInQueue) => {
            setResults(tracksInQueue);
        })  
        return () => {
            ipcRenderer.removeAllListeners('tracksQueue');
          };
    }, [])

    return (
        <p className="  text-sm">{results + " Tracks"}</p>
    )

}

export default TracksQueue;