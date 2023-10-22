import { FormControl, TextField, useFormControl } from "@mui/material";
import { useEffect, useRef, useState } from "react";

// let test: any;

const BGMInputSearch = (props: any) => {
    const { tracks, listRef, setSelectedTrack } = props;
    const inputSearchRef = useRef<any>();
    
    // const test = useRef(false);
    const [inputSearch, setInputSearch] = useState<string>('');
    // const [test, settest] = useState(false);
    const handleChange = (e: { target: { value: string; }; }) => {
        setInputSearch(e.target.value); 
        console.log(inputSearch);
        var inputIndex = (tracks.current.findIndex(function(item: any){
            return item.indexOf(inputSearch) !== -1;
        }));
        if (inputIndex == -1) {
            return
        }
        console.log(inputSearch);
        setSelectedTrack(inputIndex);
        listRef.current.scrollToItem(inputIndex, "smart");
    }

    useEffect(() => {
        window.addEventListener('keydown', e => { // add the event for key press
            // settest(true);
            if (e.key == "Shift" || e.key == "Enter" || e.key == "Alt" || e.key == "Meta") { // keys that are not needed to start the search
                return;
            }
            inputSearchRef.current.focus();
            // console.log(inputSearchRef.current);
            // console.log(e.key);
            // setInputSearch(e.key);
        });
    }, []);
    return (
        
        // <TextField className="input-search" ref={inputSearchRef} id="standard-search" label='' autoFocus={false} value={inputSearch} variant="standard" onChange={() => {
            
        //     console.log("test");
            
        // }}/>
        <div>
            <input className="search-track-input" ref={inputSearchRef} onChange={handleChange} onBlur={() => {

            }}/>
            <p className="show-track-input">{inputSearch}</p>
        </div>
    );
}

export default BGMInputSearch;