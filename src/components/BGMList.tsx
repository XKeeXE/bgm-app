import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { FixedSizeList, ListChildComponentProps } from 'react-window';

let bgmTracks: any[] = [];
let test = -1;

const Row = (props: ListChildComponentProps) => {
    const { style, index, data } = props;
    const [tester, settester] = useState(-1);
    
    return (
        <ListItem style={style} key={index}>
            <ListItemButton selected={test == index} onClick={() => {
                console.log(bgmTracks[index]);
                data(index);
                // if played do not add 1 to the current queue
            }}>
                <ListItemText primary={bgmTracks[index].replace('.mp3', '')}/>
            </ListItemButton>
        </ListItem>
    );
}

const BGMList = (props: any) => {
    const { tracks, listRef, selectedTrack, PlayTrack } = props;
    useEffect(() => {
        
    }, [])
    bgmTracks = tracks.current;
    test = selectedTrack;
    console.log(test);
    return (
        <FixedSizeList
        className="bgm-list"
        ref={listRef}
        height={400}
        width={800}
        itemSize={45}
        itemCount={tracks.current.length}
        itemData={PlayTrack}
        overscanCount={5}>
            {Row}
        </FixedSizeList>
    )
}

export default BGMList;