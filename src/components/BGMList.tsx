
import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { FixedSizeList, ListChildComponentProps } from 'react-window';


const BGMList = (props: any) => {
    const { tracks, bgm, listRef, selectedTrack, PlayTrack } = props;

    const Row = (props: ListChildComponentProps) => {
        const { style, index } = props;
        return (
            <ListItem style={style} key={index} dense={true}>
                <ListItemButton selected={selectedTrack === index} onClick={() => {
                    PlayTrack(index); // play the track of the selected index
                }} onContextMenu={() => {
                    var resultIndex = bgm.current.findIndex((track: { index: number; }) => track.index == index);
                    console.log(bgm.current[resultIndex].played)
                }}>
                    <ListItemText 
                        className="" 
                        primary={tracks.current[index].replace('.mp3', '')} 
                        primaryTypographyProps={{fontSize: 15,
                                                 fontWeight: 'small'}} 
                        />
                </ListItemButton>
            </ListItem>
        );
    }
    return (
        <FixedSizeList
        className="text-xs"
        ref={listRef}
        height={500}
        width={800}
        itemSize={50}
        itemCount={tracks.current.length}
        overscanCount={5}>
            {Row}
        </FixedSizeList>
    )
}

export default BGMList;