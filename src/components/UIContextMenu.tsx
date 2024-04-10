import { ContextMenu, ContextMenuItem, ContextMenuTrigger } from "rctx-contextmenu";
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import InfoIcon from '@mui/icons-material/Info';
import { useEffect } from "react";

var mp3Duration = require('mp3-duration');

const UIContextMenu = (props: any) => {
    const { children, bgm, forceUpdate, setForceUpdate, playedTracks, selectedTrack, selectedContext, contextTrack } = props;

    function StackTrack(contextIndex: number) {
        if (selectedTrack.current == contextIndex) {
            console.log("same track");
            return;
        }

        console.log("Stacked: " + contextTrack.current);
        // console.log(contextIndex);
        var resultIndex = bgm.current.findIndex((track: { index: number; }) => track.index == contextIndex);
        var tempBGM = JSON.parse(JSON.stringify(bgm.current));
        var stackingTrack = bgm.current[resultIndex]; // the selected track via stack
        // var lastTrack = tempBGM[bgm.current.length-1];
        for (let index = 0; index < bgm.current.length-1; index++) { // loop through all the tracks
            if (contextIndex == bgm.current[index].index) { // stop at the selected track
                // console.log("stopped at index: " + index);
                break;
            }
            tempBGM[index+1] = bgm.current[index]; // replace the track[#1234] with track[#1233]
        }
        // tempBGM[bgm.current.length-1] = lastTrack;
        tempBGM[0] = stackingTrack;
        tempBGM[0].played = false;
        bgm.current = tempBGM;
        // console.log(playedTracks.current);
        if (playedTracks.current.indexOf(contextIndex) != -1) { // if track was played
            playedTracks.current.splice(playedTracks.current.indexOf(contextIndex), 1); // remove the track from the played tracks array
        }
        // console.log(playedTracks.current);
        setForceUpdate(!forceUpdate);
    }

    return (
        <>
        <ContextMenuTrigger id="track-context">
            { children }
        </ContextMenuTrigger>

        <ContextMenu id="track-context">
            <ContextMenuItem onClick={() => {
                StackTrack(selectedContext.current);
                // console.log(selectedContext.current);
            }}><LibraryAddIcon/> Stack
            </ContextMenuItem>

            <ContextMenuItem onClick={() => {
                console.log("test")

                console.log(bgm.current);
            }}>Reset
            </ContextMenuItem>

            <ContextMenuItem onClick={() => {
                console.log("Copied " + contextTrack.current);
                navigator.clipboard.writeText(contextTrack.current);
            }}><ContentPasteIcon/> Clipboard

            </ContextMenuItem>

            <ContextMenuItem onClick={() => {
                // console.log("-----")
                // console.log("Title: " + contextTrack.current);
                // console.log("Played: " + bgm.current[bgm.current.findIndex((track: { index: number; }) => track.index == selectedContext.current)].played);
                // console.log("Track original index: " + bgm.current[selectedContext.current].index);
                // console.log("Current queue number: " + playedTracks.current.length);
                // console.log("Track index in current BGM: " + bgm.current.findIndex((track: { index: number; }) => track.index == selectedContext.current));
                // if (playedTracks.current.indexOf(selectedContext.current) != -1) {
                //     console.log("Index in played: " + playedTracks.current.indexOf(selectedContext.current));
                // } else {
                //     console.log("Index in played: None")
                // }
                // console.log("-----")
                // mp3Duration("E:/BGM/" + contextTrack.current + ".mp3", function (err: { message: any; }, duration: number) {
                //     // if (err) return console.log(err.message);
                //     console.log('Your file is ' + duration + ' seconds long');
                // });
                console.log(bgm.current[bgm.current.findIndex((track: { index: number; }) => track.index == selectedContext.current)])
            }}><InfoIcon/> Properties
            </ContextMenuItem>

            {/* <Submenu title={<InfoIcon/> + " Properties"}>
                <ContextMenuItem>VS Code</ContextMenuItem>
            </Submenu> */}


        </ContextMenu>
        </>
    )
}

export default UIContextMenu;