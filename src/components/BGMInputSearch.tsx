import { Textarea } from "@nextui-org/react";
import { useCallback, useEffect, useRef, useState } from "react";

import SearchIcon from '@mui/icons-material/Search';
import { Paper } from "@mui/material";

let timer = 0;

/**
 * When the user is focused on the app and presses a key that is not {alt, enter, shift, meta} will search trackSearch string by startWith() or includes().
 * @param props 
 * @returns hidden text input and text
 */
const BGMInputSearch = (props: any) => {
    const { tracks, listRef, currentSelectedTrack, setSelectedTrack, CheckTrackType } = props;
    const inputSearchRef = useRef<any>(); // get the input text ref
    const inputSearch = useRef<any>(''); // the string to search for in the track list
    const result = useRef<any>(); // an array of track titles
    const searchIndex = useRef(0); // index to search in the result array
    const searchTracks = useRef(tracks.current.map((track: string, index: number) => { // the tracks with title as lowered case, index, and removed type
        return Object.assign(
            {title: CheckTrackType(track.toLowerCase())},
            {index: index}
            )
        }));
        
    const [viewInput, setViewInput] = useState<string>(''); // to view the input text
    const [highlight, setHighlight] = useState<boolean>(false);
    
    function SelectTrack(selectTrack: number) {
        setSelectedTrack(selectTrack); // sets the selected track as the entered track
        listRef.current.scrollToItem(selectTrack, "center"); // scrolls in the bgm list to the selected track
    }
    
    const handleChange = (e: { target: { value: string; }; }) => {
        inputSearch.current = e.target.value;
        setViewInput(inputSearch.current); 
        searchIndex.current = 0; // reset search index as 0
        // console.log(result.current);
        if (inputSearch.current.length < 2) {
            setHighlight(false);
        } else {
            setHighlight(true);
        }
        result.current = searchTracks.current.filter((track: { title: string; }) => track.title.startsWith(inputSearch.current.toLowerCase()));
        if (result.current.length == 0) { // if the search did not start with the entered search
            result.current = searchTracks.current.filter((track: { title: string; }) => track.title.includes(inputSearch.current.toLowerCase()));
            if (result.current.length == 0) { // if in case no tracks were found by neither startWith nor includes then return nothing
                console.log("does not exist");
                return;
            }
        }
        if (inputSearch.current.length < 2) { // if nothing entered then just select the current track
            SelectTrack(currentSelectedTrack.current) // set the playing track as the selected track
            return;
        } 
        // console.log(searchIndex.current);
        // if (result.current.length > 0) {
            //     SelectTrack(result.current[searchIndex.current].index);
            
            // }
        SelectTrack(result.current[searchIndex.current].index);
    }
    
    // For when the user wants to input search then it just needs to press a key that is not the restricted ones
    const handleUserKeyPress = useCallback((event: { keyCode: any; repeat: boolean }) => {
        const { keyCode, repeat } = event;
        /**
         * List of restricted keys:
         * tab, shift, ctrl, alt, pause, caps, escape, page up, page down, end, home, print screen, insert, delete, window key, select, F#, num lock, scroll lock, and various others 
        */
        if (keyCode < 13 && keyCode > 13 || keyCode >= 33 && keyCode <= 36 || keyCode >= 91 && keyCode <= 93 || keyCode >= 112 && keyCode <= 183) { // if restricted key return
            return;
        }
        if ((keyCode < 37 || keyCode > 40) && keyCode != 13 ) { // if not arrow keys then focus to input and return && if not enter
            inputSearchRef.current.focus(); // for when pressing a key to automatically insert into the input
            return;
        }
        if (keyCode == 13 && result.current.length >= 1) { // if enter pressed and there are results, then set the current selected track as the first that is on the results
            inputSearchRef.current.focus();
            // console.log(result.current[0].index)
            SelectTrack(result.current[0].index);
            searchIndex.current = 0;
            return;
        }
        inputSearchRef.current.blur(); // if arrow keys then blur input search so that arrow keys do not get inserted into the input
        if (result.current == undefined || result.current.length <= 1) { // when starting app and want to use arrow keys or if result array has 1 or 0 results then just return
            return;
        }
        timer++ // depending on how long the arrow key was pressed then manipulate the behaviour of the arrow keys search
        if (repeat == false) { // when starting pressing the arrow keys then reset the timer to 0
            timer = 0;
        }
        if (timer <= 10) { // if timer less than or equal to 10, add 1 or subtract 1
            if (keyCode == 37 || keyCode == 38) { // if arrow key left or up
                searchIndex.current = searchIndex.current-1; // subtract 1 to the search index
                if (searchIndex.current < 0) { // if search index is less than 0 then put the index as the last index of the result length
                    searchIndex.current = result.current.length-1; // set search index as last element
                }
            } else if (keyCode == 39 || keyCode == 40) { // if arrow key right or down
                searchIndex.current = searchIndex.current+1; // add 1 to the search index
                if (searchIndex.current >= result.current.length) { // if search index is exactly the length of the result length then just put the search index as the beginning index
                    searchIndex.current = 0; // set search index as first element
                }
            }
        // ----------------------
        } else if (timer > 10 && timer < 30) { // if timer more than 10 and less than 30, add 5 or subtract 5
            if (keyCode == 37 || keyCode == 38) { // if arrow key left or up
                searchIndex.current = searchIndex.current-5; // subtract 5 to the search index
                if (searchIndex.current < 0) { // if subtracted more than usual (ex: 2-5 = -3) then set search index as first element
                    searchIndex.current = 0; // set search index as first element
                }
            } else if (keyCode == 39 || keyCode == 40) { // if arrow key right or down
                searchIndex.current = searchIndex.current+5; // add 5 to the search index
                if (searchIndex.current >= result.current.length) { // if added more than usual (ex: result.length = 20, searchIndex = 19, 19+5 = 24) then set search index as last element
                    searchIndex.current = result.current.length-1; // set search index as last element
                }
            }
        // ----------------------
        } else { // if timer more than or equal to 30, then select first or last element
            if (keyCode == 37 || keyCode == 38) { // if arrow key left or up
                searchIndex.current = 0; // set search index as first element
            } else if (keyCode == 39 || keyCode == 40) { // if arrow key right or down
                searchIndex.current = result.current.length-1;  // set search index as last element
            }
        }
        // console.log(timer);
        // console.log(searchIndex)
        SelectTrack(result.current[searchIndex.current].index)
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);
        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    }, [handleUserKeyPress]);
    
    return (
        // <div className="absolute justify-center align-middle flex">
        //     <input className="absolute opacity-0 top-96" ref={inputSearchRef} onChange={handleChange}/>
        // <p className="absolute bottom-0 text-center w-96 select-none">{viewInput}</p>
        // </div>
        <div className="relative max-w-[680px] flex items-center">
            <div className="w-[25px] h-[25px]">
                <SearchIcon color={ highlight ? "inherit" : "disabled"}/>
            </div>
            <Textarea ref={inputSearchRef} maxRows={1} variant="underlined" onChange={handleChange} value={viewInput} style={{
                // width: "50%"
                textDecoration: 'none'
            }}/>

        </div>
    );
}

export default BGMInputSearch;