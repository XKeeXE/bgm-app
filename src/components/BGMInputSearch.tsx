import { useEffect, useRef, useState } from "react";

const BGMInputSearch = (props: any) => {
    const { tracks, listRef, currentSelectedTrack, setSelectedTrack } = props;
    const inputSearchRef = useRef<any>(); // get the input text ref
    const inputSearch = useRef<any>(''); // the string to search for in the track list
    const searchTracks = useRef(tracks.current.map((track: string, index: number) => { // the tracks with title as lowered case, index, and removed .mp3
        return Object.assign(
            {title: track.toLowerCase().replace('.mp3', '')},
            {index: index}
        )
    }));

    const [viewInput, setViewInput] = useState(''); // to view the input
    
    function SelectTrack(selectTrack: number) {
        setSelectedTrack(selectTrack);
        listRef.current.scrollToItem(selectTrack, "center");
    }

    const handleChange = (e: { target: { value: string; }; }) => {
        inputSearch.current = e.target.value;
        setViewInput(inputSearch.current); 
        let result = searchTracks.current.filter((track: { title: string; }) => track.title.startsWith(inputSearch.current.toLowerCase()));
        if (result.length == 0) { // if the search did not start with the entered search
            result = searchTracks.current.filter((track: { title: string; }) => track.title.includes(inputSearch.current.toLowerCase()));
            if (result == 0) { // if in case no tracks were found by neither startWith nor includes then return nothing
                console.log("does not exist");
                return;
            }
        }
        if (inputSearch.current.length < 2) { // if nothing entered then just select the current track
            SelectTrack(currentSelectedTrack.current) // set the playing track as the selected track
            return;
        }
        SelectTrack(result[0].index) // set first result as the selected track
    }
    // For when the user wants to input search then it just needs to press a key that is not the restricted ones
    useEffect(() => {
        window.addEventListener('keydown', e => { // add the event for key press
            if (e.key == "Shift" || e.key == "Enter" || e.key == "Alt" || e.key == "Meta") { // keys that are not needed to start the search
                return;
            }
            inputSearchRef.current.focus(); // auto select the text input to start searching for tracks
        });
    }, []);
    return (
        <div>
            <input className="search-track-input" ref={inputSearchRef} onChange={handleChange} onBlur={() => {
                SelectTrack(currentSelectedTrack.current) // set the playing track as the selected track if no longer focused on text input
            }}/>
            <p className="show-track-input">{viewInput}</p>
        </div>
    );
}

export default BGMInputSearch;