import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { FixedSizeList, ListChildComponentProps } from 'react-window';

const BGMList = (props: any) => {
    const { tracks, bgm, bgmIndex, listRef, selectedTrack, PlayTrack } = props;

    const Row = (props: ListChildComponentProps) => {
        const { style, index } = props;
        return (
            <ListItem style={style} key={index}>
                <ListItemButton selected={selectedTrack === index} onClick={() => {
                    // console.log(index);
                    var resultIndex = bgm.current.findIndex((track: { index: number; }) => track.index == index); // find the track index in the current queue of the selected track
                    bgm.current[resultIndex].played = true; // lo quita pero hay un bug en que el current queue se chupa el next track

                    // console.log(resultIndex);
                    // console.log(bgm.current[resultIndex]);
                    // console.log(bgm.current.length);
                    // console.log(bgmIndex.current);
                    // bgmIndex.current = index;
                    PlayTrack(index);
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