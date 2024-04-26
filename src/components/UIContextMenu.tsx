import { ContextMenu, ContextMenuItem, ContextMenuTrigger } from "rctx-contextmenu";
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import InfoIcon from '@mui/icons-material/Info';
import PlayIcon from "@mui/icons-material/PlayArrow";

var mp3Duration = require('mp3-duration');

const UIContextMenu = (props: any) => {
    const { children, bgm, currentTrackTitle, forceUpdate, setForceUpdate, playedTracks, PlayTrack, TranslateTrackToBGM, selectedTrack, selectedContext, contextTrack } = props;

    function StackTrack(contextIndex: number) {
        if (selectedTrack.current == contextIndex || currentTrackTitle.current == contextTrack.current) {
            console.log("same track");
            return;
        }

        console.log("Stacked: " + contextTrack.current);
        var resultIndex = bgm.current.findIndex((track: { index: number; }) => track.index == contextIndex);
        var tempBGM = JSON.parse(JSON.stringify(bgm.current));
        var stackingTrack = bgm.current[resultIndex]; // the selected track via stack
        for (let index = 0; index < bgm.current.length-1; index++) { // loop through all the tracks
            if (contextIndex == bgm.current[index].index) { // stop at the selected track
                // console.log("stopped at index: " + index);
                break;
            }
            tempBGM[index+1] = bgm.current[index]; // replace the track[#1234] with track[#1233]
        }
        tempBGM[0] = stackingTrack;
        tempBGM[0].played = false;
        bgm.current = tempBGM;
        if (playedTracks.current.indexOf(contextIndex) != -1) { // if track was played
            playedTracks.current.splice(playedTracks.current.indexOf(contextIndex), 1); // remove the track from the played tracks array
        }
        setForceUpdate(!forceUpdate);
    }

    return (
        <>
        <ContextMenuTrigger id="track-context">
            { children }
        </ContextMenuTrigger>

        <ContextMenu id="track-context" className="">
            <ContextMenuItem onClick={() => {
                StackTrack(selectedContext.current);
                // console.log(selectedContext.current);
            }}><LibraryAddIcon/> Stack
            </ContextMenuItem>

            <ContextMenuItem onClick={() => {
                PlayTrack(selectedContext.current);
            }}><PlayIcon/> Play
            </ContextMenuItem>

            <ContextMenuItem onClick={() => {
                console.log("Copied " + contextTrack.current);
                navigator.clipboard.writeText(contextTrack.current);
            }}><ContentPasteIcon/> Clipboard

            </ContextMenuItem>

            <ContextMenuItem onClick={() => {
                console.log("-----")
                console.log("Title: " + contextTrack.current);
                console.log("Played: " + TranslateTrackToBGM(selectedContext.current).played);
                console.log("Track original index: " + selectedContext.current);
                console.log("Current queue number: " + playedTracks.current.length);
                console.log("Track index in current BGM: " + bgm.current.findIndex((track: { index: number; }) => track.index == selectedContext.current));
                if (playedTracks.current.indexOf(selectedContext.current) != -1) {
                    console.log("Index in played: " + playedTracks.current.indexOf(selectedContext.current));
                } else {
                    console.log("Index in played: None")
                }
                console.log("-----")
                // mp3Duration("E:/BGM/" + contextTrack.current + ".mp3", function (err: { message: any; }, duration: number) {
                    // if (err) return console.log(err.message);
                    // console.log('Your file is ' + duration + ' seconds long');
                // });
                // console.log(bgm.current[bgm.current.findIndex((track: { index: number; }) => track.index == selectedContext.current)])
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