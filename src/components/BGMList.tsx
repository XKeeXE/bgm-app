import { ListItem, ListItemButton, ListItemText, TableCell, TableRow } from "@mui/material";
import { Divider, PopoverContent, Popover, Tooltip } from "@nextui-org/react";
import { useRef, useState } from "react";
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import UIContextMenu from "./UIContextMenu";
import { TableVirtuoso } from "react-virtuoso";
var mp3Duration = require('mp3-duration');

let maxStringLength = 70;

interface TrackData {
    title: string;
    duration: number;
    played: boolean;
}

interface ColumnData {
    dataKey: keyof TrackData;
    label: string;
    numeric?: boolean;
    width: number;
}


/**
 * A list to show the current read file tracks
 * @param props 
 * @returns a list containing tracks
 */
const BGMList = (props: any) => {
    const { tracks, bgm, currentTrackTitle, forceUpdate, setForceUpdate, playedTracks, listRef, selectedTrack, CheckTrackType, PlayTrack } = props;

    const selectedContext = useRef<number>(0);
    const contextTrack = useRef<string>('');

    // function CheckPlayed(index: number): string {
    //     var resultIndex = bgm.current.findIndex((track: { index: number; }) => track.index == index);
    //     return bgm.current[resultIndex].played
    // }

    

    const Row = (props: ListChildComponentProps) => {
        const { style, index } = props;
        return (
            <ListItem style={style} key={index} dense={true}>
                {/* <Tooltip content={CheckPlayed(index).toString()} showArrow delay={500} placement="left-start"> */}
                    <ListItemButton className="overflow-hidden" selected={selectedTrack === index} onClick={() => {
                        PlayTrack(index); // play the track of the selected index
                    }}>
                        <div className="hover:translate-x-2 w-[100%]">
                            <Divider/>
                            <ListItemText 
                                className="font-custom" 
                                // primary={CheckTrackType(tracks.current[index])} 
                                primary={CheckTrackType(tracks.current[index]).length > maxStringLength ? 
                                tracks.current[index].substring(0, maxStringLength-3).concat('...') : CheckTrackType(tracks.current[index])} 

                                // primaryTypographyProps={{fontSize: 15, fontFamily: ''
                                //     fontWeight: 'small'}} 
                                disableTypography
                                
                                onContextMenu={() => {
                                    selectedContext.current = index;
                                    contextTrack.current = CheckTrackType(tracks.current[index]);
                                }}/>
                        </div>
                    </ListItemButton>
                {/* </Tooltip> */}
            </ListItem>
        );
    }
    return (
        <>
        <UIContextMenu tracks={tracks} bgm={bgm} currentTrackTitle={currentTrackTitle} forceUpdate={forceUpdate} setForceUpdate={setForceUpdate} playedTracks={playedTracks} 
        PlayTrack={PlayTrack} selectedTrack={selectedTrack} selectedContext={selectedContext} contextTrack={contextTrack}>
            {/* <FixedSizeList
                className="overflow-ellipsis"
                style={{
                    width: '60vw',
                    // minWidth: '500px'
                    // height: '86vh'
                }}
                direction="ltr"
                ref={listRef}
                height={400}
                width={680}
                itemSize={50}
                itemCount={tracks.current.length}
                overscanCount={5}>
                {Row}
            </FixedSizeList> */}
            <div className="h-[78vh] w-[50vw] overflow-y-auto">
                <ul className=" ">
                    {tracks.current.map((track: any, index: number) => (
                        <li key={track} className=" whitespace-nowrap overflow-hidden " onClick={() => {
                            PlayTrack(index);
                        }} onContextMenu={() => {
                            selectedContext.current = index;
                            contextTrack.current = tracks.current[index];
                        }}>
                            {CheckTrackType(track)}
                        </li>
                    ))}
                </ul>

            </div>
        </UIContextMenu>
        </>
    )
}

export default BGMList;