import { useEffect, useRef, useState } from "react";

let queue: string[] = [];
let maxStringLength = 65;

const BGMCurrentQueue = (props: any) => {
    const { currentUrl, bgm, tracks, bgmIndex } = props;
    const [results, setResults] = useState<string>("None"); // <- lo que hace que este component haga re-render para que el queue se vea bien
    /**
     * lo tuve que poner todo en el useEffect para que se active cuando currentUrl haga update para que se pueda re-render el queue bien
     * ya que raw sin useEffect va a re-render infinitamente
    */
   useEffect(() => {
        const bgmQueue: any[] = []; // the array of tracks of the next 10 tracks if possible
        const unplayedQueue: number[] = [];
        var tempIndex = 0; // times the for loop occured [min=1, max=10], 0 if none
        let numberPlayedTracks = 0; // how many tracks have played in the current queue
        let undefinedTimes = 0;
        let finalTrackIndex = 0; // named liked that because when for loop finishes will get the final index of the following 10 tracks
        var queueTracks: any; // declared as var for organization for find index and find
        let trackString: string;
        for (let index = 0; index < 11; index++) { // en vez de index < 10, se tuvo que cambiar a index < 11 para hacerle queue.shift y quitar el primero
            queueTracks = bgm.current.findIndex((bgm: { played: boolean; }) => bgm.played === false); // get index of queue of the track in current queue
            // console.log(bgm.current[queueTracks]);
            if (bgm.current.length - queueTracks < 0 || queueTracks == -1 ) { // bgm.length = 3000, if 3000-3000 < 0 or if all tracks have been played, break
                break;
            }
            finalTrackIndex = queueTracks; // when for loop finishes get the final track index
            numberPlayedTracks = queueTracks; // index of current queue
            queueTracks = bgm.current.find((bgm: { played: boolean; }) => bgm.played === false); // find the next track in the current queue
            if (queueTracks === undefined) { // since it is possible to give undefined when all tracks have been played break from the loop
                break;
            }
            bgm.current[finalTrackIndex].played = true; // mark the bgm to played true to find next track in the current queue
            unplayedQueue.push(numberPlayedTracks); // store the tracks indexes that are in the current queue to use it later to revert the process of played true
            if (tracks.current[queueTracks.index] == undefined) { // if for some reason the track is undefined as it was removed or something
                trackString = "---{Undefined Track}---";
                undefinedTimes = undefinedTimes+1;
                trackString = trackString.concat(undefinedTimes.toString());
            } else {
                trackString = tracks.current[queueTracks.index].replace('.mp3', ''); // else remove .mp3 from the track
            }
            
            if (trackString.length > maxStringLength) { // if track has max string length of 63 put ... after it. Ex: TestTrack
                let tempString = '';
                tempString = trackString.substring(0, maxStringLength-3) // remove only the last 3 strings. ex: TestTr
                trackString = tempString.concat("..."); // concat ... to the track string. ex: TestTr...
            }
            bgmQueue.push(trackString); // put the string of the tracks into the queue
            // console.log(bgmQueue);
            tempIndex = index; // number of times the loop occurred [min=1, max=10]
        }
        // console.log(unplayedQueue);
        // unplayedQueue.shift()
        // console.log(bgmQueue);
        // console.log(tracks.current[bgm.current[unplayedQueue[0]].index]);
        // Since the tracks were marked true revert the process and mark it false 
        for (let index = unplayedQueue.length-1; index >= 0; index--) {
            // if (index == 0) { // skip the index 0 as that is the playing track and we dont want to mark it as played false
            //     break;
            // }
            // console.log(tracks.current[bgm.current[unplayedQueue[index]].index]);
            bgm.current[unplayedQueue[index]].played = false; // mark the track as played false so that they may be playable again when queue reaches track
        }
        // bgmIndex.current = unplayedQueue[0];
        setResults(tempIndex + " / " + (bgm.current.length - numberPlayedTracks+1) + " result(s) displayed"); // <- el re-render hace que el queue haga display correctamente
        queue = bgmQueue.map(item => item) // map bgmQueue into queue to show it on the list
        queue.shift(); // remove the first element as that would be the one playing in the current queue
        // if (bgmIndex.current != -1) {
        //     const trackIndex = bgm.current.map((track: { index: any; }) => track.index).indexOf(bgmIndex.current);
        //     bgm.current[trackIndex].played = true;
        //     console.log(bgm.current[trackIndex]);
            
        // }
        
    }, [currentUrl]);
    
    return (
        <>
        {queue.length === 0 && <p>No current queue found</p>}
        <ul className="bgm-queue">
            {queue.map((item) => 
            <li key={item}>{item}
            </li>)}
        </ul>
        <p className="bgm-results">{results}</p>
        </>
    );
} 

export default BGMCurrentQueue;