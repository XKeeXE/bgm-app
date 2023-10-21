import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { FixedSizeList, ListChildComponentProps } from 'react-window';

let bgmTracks: any[] = [];

const Row = (props: ListChildComponentProps) => {
    const { style, index, data, test } = props;
    // selected={data === index}
    return (
        <ListItem style={style} key={index}>
            <ListItemButton onClick={() => {
                console.log(bgmTracks[index]);
                // console.log(test);
                data(index);
                // test(index);
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