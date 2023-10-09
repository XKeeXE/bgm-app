import { useEffect, useState } from "react";

let queue: string[] = [];

const BGMCurrentQueue = (props: any) => {
    const { currentUrl, bgm, tracks } = props;
    const [results, setResults] = useState<string>("None"); // <- lo que hace que este component haga re-render para que el queue se vea bien
    /**
     * lo tuve que poner todo en el useEffect para que se active cuando currentUrl haga update para que se pueda re-render el queue bien
     * ya que raw sin useEffect va a re-render infinitamente
     */
    useEffect(() => {
        const bgmQueue: any[] = []; // the array of tracks of the next 10 tracks if possible
        var tempIndex = 0; // times the for loop occured [min=1, max=10], 0 if none
        let currentQueue = 0; // how many tracks have played in the current queue
        let finalTrackIndex = 0; // named liked that because when for loop finishes will get the final index of the following 10 tracks
        let tracksIndex = 0; // the bgmIndex of this component
        var queueTracks: any; // declared as var for organization for find index and find
        for (let index = 0; index < 11; index++) { // en vez de index < 10, se tuvo que cambiar a index < 11 para hacerle queue.shift y quitar el primero
            queueTracks = bgm.findIndex((bgm: { played: boolean; }) => bgm.played === false); // get index of queue of the track in current queue
            if (bgm.length - queueTracks < 0 || queueTracks == -1 ) { // bgm.length = 3000, if 3000-3000 < 0 or if all tracks have been played, break
                break;
            }
            finalTrackIndex = queueTracks; // when for loop finishes get the final track index
            currentQueue = queueTracks; // index of current queue
            queueTracks = bgm.find((bgm: { played: boolean; }) => bgm.played === false); // find the next track in the current queue
            if (queueTracks === undefined) { // since it is possible to give undefined when all tracks have been played break from the loop
                break;
            }
            bgm[finalTrackIndex].played = true; // mark the bgm to played true to find next track
            bgmQueue.push(tracks[queueTracks.index]); // put the name of the tracks into the queue
            tempIndex = index+1; // add 1 into the times it ocurred for real life numbers [min=1, max=10] as for loop starts at 0 and ends on 9
        }
        // Since the tracks were marked true revert the process and mark it false the amount of tracks were marked true
        for (let index = tempIndex; index > 0; index--) { // if queue had more than 11 elements then revert 11 elements
            tracksIndex = finalTrackIndex - index; // revert the process, ex: current queue index = 22 pues de 33 va a revert hasta que sea 22
            bgm[tracksIndex+1].played = false; 
        }
        setResults(tempIndex-1 + " / " + (bgm.length - currentQueue+1) + " result(s) displayed"); // <- el re-render hace que el queue haga display correctamente
        queue = bgmQueue.map(item => item) // map bgmQueue into queue to show it on the list
        queue.shift(); // remove the first element as that would be the one playing in the current queue
    }, [currentUrl]);

    return (
        <>
        {queue.length === 0 && <p>No current queue found</p>}
        <ul className="bgm-queue">
            {queue.map((item) => 
            <li key={item}>{item.replace('.mp3', '')}
            </li>)}
        </ul>
        <p className="bgm-results">{results}</p>
        </>
    );
} 

export default BGMCurrentQueue;