import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { FixedSizeList, ListChildComponentProps } from 'react-window';

const BGMList = (props: any) => {
    const { tracks, listRef, selectedTrack, PlayTrack } = props;

    const Row = (props: ListChildComponentProps) => {
        const { style, index } = props;
        return (
            <ListItem style={style} key={index}>
                <ListItemButton selected={selectedTrack === index} onClick={() => {
                    PlayTrack(index); // play the track of the selected index
                }}>
                    <ListItemText primary={tracks.current[index].replace('.mp3', '')}/>
                </ListItemButton>
            </ListItem>
        );
    }
    return (
        <FixedSizeList
        className="bgm-list"
        ref={listRef}
        height={400}
        width={800}
        itemSize={45}
        itemCount={tracks.current.length}
        overscanCount={5}>
            {Row}
        </FixedSizeList>
    )
}

export default BGMList;