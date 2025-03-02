import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { BGMContext } from "../App";
// import { track } from "./types/types";

import * as Icons from './Icons';

let timer = 0;

const startTransform = -70

interface results {
    id: number,
    title: string
}

/**
 * When the user is focused on the app and presses a key that is not {alt, enter, shift, meta} will search trackSearch string by startWith() or includes().
 * @param props 
 * @returns hidden text input and text
 */
const BGMInputSearch = (props: any) => {
    const { searching, setSearchingID} = props;
    const { bgm, currentTrack, focus, ScrollToIndex } = useContext(BGMContext);

    const inputSearchRef = useRef<HTMLDivElement>(null); // get the input text ref
    const inputRef = useRef<HTMLInputElement>(null); // get the input text ref
    const inputSearch = useRef<string>(''); // the string to search for in the track list
    const result = useRef<results[]>([]); // an array of track titles
    const searchIndex = useRef<number>(0); // index to search in the result array
    const availableTracks = useRef<results[]>([]); // the tracks with title as lowered case, index, and removed type
    
    const [viewInput, setViewInput] = useState<string>(''); // to view the input text
    const [highlight, setHighlight] = useState<boolean>(false);

    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);
        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    }, []);

    useEffect(() => {
        if (!searching) ScrollToIndex(currentTrack.id);
    }, [currentTrack])

    useEffect(() => {
        availableTracks.current = [...bgm.values()].map(track => ({
            id: track.id,
            title: track.title.toLowerCase()
        }));
    }, [bgm])

    function CurrentTransform() {
        const currentTransform = getComputedStyle(inputSearchRef.current!).transform;
        const regex = /matrix\(1, 0, 0, 1, 0, ([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?\)/i;
        return currentTransform.match(regex)![1];
    }

    function SetSelectedTrack(index: number) {
        setSearchingID(index)
        ScrollToIndex(index)
    }
    
    const handleInputChange = (e: { target: { value: string; }; }) => {
        inputSearch.current = e.target.value;
        setViewInput(inputSearch.current); 
        searchIndex.current = 0; // reset search index as 0
        console.log(result.current);
        if (inputSearch.current.length < 2) { // if nothing entered
            result.current = []
            setHighlight(false);
            searching.current = false;
            SetSelectedTrack(currentTrack.id)
            return;
        } else {
            searching.current = true;
            setHighlight(true);
        }
        result.current = availableTracks.current.filter(track => track.title.startsWith(inputSearch.current.toLowerCase()));
        // console.log(result.current);
        if (result.current.length == 0) { // if the search did not start with the entered search
            result.current = availableTracks.current.filter(track => track.title.includes(inputSearch.current.toLowerCase()));
            if (result.current.length == 0) { // if in case no tracks were found by neither startWith nor includes then return nothing
                console.log("does not exist");
                return;
            }
        }
        SetSelectedTrack(result.current[searchIndex.current].id);
    }

    const updateSearchIndex = (increment: number) => {
        searchIndex.current = Math.max(0, Math.min(result.current.length - 1, searchIndex.current + increment));
    };
    
    // // For when the user wants to input search then it just needs to press a key that is not the restricted ones
    const handleUserKeyPress = useCallback((e: { keyCode: number; repeat: boolean }) => {
        const { keyCode, repeat } = e;
        /**
         * List of restricted keys (Keys that will NOT activate the input search):
         * tab, shift, ctrl, alt, pause, caps, escape, page up, page down, end, home, print screen, insert, delete, window key, select, F#, num lock, scroll lock, and various others 
        */
        if  (keyCode < 36 && keyCode !== 27 && keyCode !== 13 ||
            (keyCode >= 33 && keyCode <= 36) || 
            (keyCode >= 91 && keyCode <= 93) ||
            (keyCode === 32 && !focus.current) || // If space bar and is not focused
            (keyCode >= 112 && keyCode <= 183)) return // if restricted key return

        if ((keyCode < 37 || keyCode > 40) && keyCode !== 13 ) { // Not Enter or arrow keys
            if ((keyCode === 27 || keyCode === 13) && focus.current) { // when esc is pressed and is focused then just hide the input search (Enter hides if there are no results (BUG but FEATURE?!?!?!))
                inputRef.current!.blur();
                return;
            }
            inputRef.current!.focus(); // for when pressing a key to automatically insert into the input
            return;
        }
        if (keyCode === 13 && result.current.length > 0) { // Enter key with results
            inputRef.current!.focus();
            SetSelectedTrack(result.current[0].id);
            searchIndex.current = 0;
            return;
        }
        inputRef.current!.blur(); // if arrow keys then blur input search so that arrow keys do not get inserted into the input
        if (!result.current || result.current.length <= 1) return // when starting app and want to use arrow keys or if result array has 1 or 0 results then just return
        
        timer = repeat ? timer + 1 : 0; 

        if (timer <= 10) {
            if (keyCode === 37 || keyCode === 38) {
                if (searchIndex.current-1 < 0) searchIndex.current = result.current.length; // Go to the last element
                updateSearchIndex(-1); // Left/Up (Search 1 up)
            }
            else if (keyCode === 39 || keyCode === 40) {
                if (searchIndex.current+1 == result.current.length) searchIndex.current = -1; // Go to the first element
                updateSearchIndex(1); // Right/Down (Search 1 down)
            }
        } else if (timer < 30) {
            if (keyCode === 37 || keyCode === 38) updateSearchIndex(-5); // Left/Up (Search 5 up)
            else if (keyCode === 39 || keyCode === 40) updateSearchIndex(5); // Right/Down (Search 5 down)
        } else {
            if (keyCode === 37 || keyCode === 38) searchIndex.current = 0; // Left/Up (Search first)
            else if (keyCode === 39 || keyCode === 40) searchIndex.current = result.current.length - 1; // Right/Down (Search last)
        }

        // console.log(timer);
        // console.log(searchIndex)
        SetSelectedTrack(result.current[searchIndex.current].id);
    }, []);
    
    return (
        <div className='flex justify-center '>
            <div ref={inputSearchRef} className={`inputSearch absolute translate-y-[-70px] flex flex-row w-[50vw] max-w-[400px] top-4 p-2 rounded-full z-10 border-2 `}>
                <div className="basis-[10%]">
                    <Icons.Search color={ highlight ? "inherit" : "disabled"}/>
                </div>
                <input tabIndex={-1} className="basis-[90%] bg-transparent border-b-1 border-gray-600 outline-none focus:border-b-slate-100" spellCheck={false} ref={inputRef} onChange={handleInputChange} value={viewInput} 
                onFocus={() => {
                    focus.current = true;
                    inputSearchRef.current!.animate(
                        [
                            { transform: `translateY(${startTransform}px)` },
                            { transform: `translateY(0px)` }
                        ],
                        {
                            duration: 220,
                            fill: 'forwards'
                        }
                    );
                }} onBlur={() => {
                    focus.current = false;
                    inputSearchRef.current!.animate(
                        [
                            { transform: `translateY(${CurrentTransform()}px)` },
                            { transform: `translateY(${startTransform}px)` }
                        ],
                        {
                            duration: 220,
                            fill: 'forwards'
                        }
                    );
                }}/>
                <div className="basis-[10%]"/>
                {/* <div className="basis-[10%] cursor-pointer flex justify-center" onMouseDown={() => {
                    inputSearch.current = '';
                    setViewInput(''); 
                    searchIndex.current = 0;
                    console.log('test');
                }}>
                    <Icons.Clear/>
                </div> */}
            </div>
        </div>
    );
}

export default BGMInputSearch;