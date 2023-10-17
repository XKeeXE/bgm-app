import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useEffect } from "react";
import { FixedSizeList, ListChildComponentProps } from 'react-window';

let test: any[] = [];

const Row = (props: ListChildComponentProps) => {
    const { style, index, data } = props;
    return (
        <ListItem style={style} key={index}>
            <ListItemButton onClick={() => {
                console.log(test[index]);
                data(index);
                // if played do not add 1 to the current queue
            }}>
                <ListItemText primary={test[index].replace('.mp3', '')}/>
            </ListItemButton>
        </ListItem>
    );
}

const BGMList = (props: any) => {
    const { tracks, listRef, PlayTrack } = props;
    useEffect(() => {
    }, [])
    test = tracks.current;
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