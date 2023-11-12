import { useCallback, useEffect, useRef, useState } from "react";

/**
 * When the user is focused on the app and presses a key that is not {alt, enter, shift, meta} will search trackSearch string by startWith() or includes().
 * @param props 
 * @returns hidden text input and text
 */
const BGMInputSearch = (props: any) => {
    const { tracks, listRef, currentSelectedTrack, setSelectedTrack } = props;
    const inputSearchRef = useRef<any>(); // get the input text ref
    const inputSearch = useRef<any>(''); // the string to search for in the track list
    const result = useRef<any>(); // an array of track titles
    const searchIndex = useRef(0); // index to search in the result array
    const searchTracks = useRef(tracks.current.map((track: string, index: number) => { // the tracks with title as lowered case, index, and removed .mp3
        return Object.assign(
            {title: track.toLowerCase().replace('.mp3', '')},
            {index: index}
            )
        }));
        
    const [viewInput, setViewInput] = useState(''); // to view the input text
    
    function SelectTrack(selectTrack: number) {
        setSelectedTrack(selectTrack); // sets the selected track as the entered track
        listRef.current.scrollToItem(selectTrack, "center"); // scrolls in the bgm list to the selected track
    }
    
    const handleChange = (e: { target: { value: string; }; }) => {
        inputSearch.current = e.target.value;
        setViewInput(inputSearch.current); 
        searchIndex.current = 0; // reset search index as 0
        // console.log(result.current);
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
        SelectTrack(result.current[searchIndex.current].index);
    }
    
    // For when the user wants to input search then it just needs to press a key that is not the restricted ones
    const handleUserKeyPress = useCallback((event: { keyCode: any; }) => {
        const { keyCode } = event;
        // console.log(keyCode);
        /**
         * List of restricted keys:
         * tab, enter, shift, ctrl, alt, pause, caps, escape, page up, page down, end, home, print screen, insert, delete, window key, select, F#, num lock, scroll lock, and various others 
         */
        if (keyCode != 8 && keyCode <= 27 || keyCode >= 33 && keyCode <= 36 || keyCode >= 91 && keyCode <= 93 || keyCode >= 112 && keyCode <= 183) { // if restricted key return
            return;
        }
        if (keyCode < 37 || keyCode > 40) { // if not arrow keys then focus to input and return
            inputSearchRef.current.focus(); // for keys to be inserted into the input
            return;
        }
        inputSearchRef.current.blur(); // if arrow keys then blur input search so that arrow keys do not get inserted into the input
        if (result.current == undefined || result.current.length <= 1) { // when starting app and want to use arrow keys or if result array has 1 or 0 results then just return
            return;
        }
        if (keyCode == 37 || keyCode == 38) { // if arrow key left or up
            searchIndex.current = searchIndex.current-1; // subtract 1 to the search index
            if (searchIndex.current < 0) { // if search index is less than 0 then put the index as the last index of the result length
                searchIndex.current = result.current.length-1; // set search index as last element
            }
        } else if (keyCode == 39 || keyCode == 40) { // if arrow key right or down
            searchIndex.current = searchIndex.current+1; // add 1 to the search index
            console.log(searchIndex);
            if (searchIndex.current >= result.current.length) { // if search index is exactly the length of the result length then just put the search index as the beginning index
                searchIndex.current = 0; // set search index as first element
            }
        }
        SelectTrack(result.current[searchIndex.current].index)
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);
        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    }, [handleUserKeyPress]);
    
    return (
        <div className="absolute justify-center align-middle flex">
            <input className="absolute opacity-0 top-96" ref={inputSearchRef} onChange={handleChange}/>
            <p className="absolute bottom-0 text-center w-96">{viewInput}</p>
        </div>
    );
}

export default BGMInputSearch;