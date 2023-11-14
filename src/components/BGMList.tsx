
import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Divider, Tooltip } from "@nextui-org/react";
import { FixedSizeList, ListChildComponentProps } from 'react-window';

let maxStringLength = 70;

const BGMList = (props: any) => {
    const { tracks, bgm, listRef, selectedTrack, CheckTrackType, PlayTrack } = props;

    function CheckPlayed(index: number): string {
        var resultIndex = bgm.current.findIndex((track: { index: number; }) => track.index == index);
        return bgm.current[resultIndex].played
    }

    const Row = (props: ListChildComponentProps) => {
        const { style, index } = props;
        return (
            <ListItem style={style} key={index} dense={true}>
                <Tooltip content={CheckPlayed(index).toString()} showArrow delay={500} placement="left-start">
                    <ListItemButton className="overflow-hidden" selected={selectedTrack === index} onClick={() => {
                        PlayTrack(index); // play the track of the selected index
                    }}>
                        <div className="hover:translate-x-2 w-[100%] ">
                            <Divider/>

                            <ListItemText 
                                className="" 
                                primary={CheckTrackType(tracks.current[index]).length > maxStringLength ? 
                                tracks.current[index].substring(0, maxStringLength-3).concat('...')
                                : 
                                CheckTrackType(tracks.current[index]) } 
                                primaryTypographyProps={{fontSize: 15,
                                    fontWeight: 'small'}} 
                                    />
                        </div>
                    </ListItemButton>
                </Tooltip>
            </ListItem>
        );
    }
    return (
            <FixedSizeList
            className=" ltr:bg-white overflow-hidden"
            direction="ltr"
            ref={listRef}
            height={400}
            width={680}
            itemSize={40}
            itemCount={tracks.current.length}
            overscanCount={5}>
                {Row}
            </FixedSizeList>
    )
}

export default BGMList;